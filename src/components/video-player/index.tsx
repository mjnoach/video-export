import { useContext, useEffect, useState } from 'react'

import { useExport } from '@/lib/api'
import { cn } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import { Loading } from '../loading'
import { Slider, Sliders } from '../ui/slider'
import { PlayerControls } from './player-controls'
import { SliderControls } from './slider-controls'

import ReactPlayer from 'react-player/lazy'

type VideoPlayerProps = DefaultProps & {
  video: SourceVideo
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isLoadingPlayer, setLoadingPlayer] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValues, setSliderValues] = useState([0, 0, 0])

  const {
    actions,
    setActions,
    isProcessing,
    setProcessing,
    storeObject,
    clip,
    updateClip,
  } = useContext(EditorContext)

  const { refetch: exportQuery } = useExport(clip)

  useEffect(() => {
    if (hasReachedEnd()) setIsPlaying(false)
    updateClip({
      start: getSlider('Start'),
      end: getSlider('End'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues])

  useEffect(() => {
    player && setSliderValues([0, 0, player.getDuration()])
    setActions({
      previewClip,
      exportClip,
    })

    const internalPlayer = player?.getInternalPlayer()
    if (internalPlayer) {
      const title = internalPlayer.videoTitle
      updateClip({
        sourceVideo: {
          url: video.url,
          title,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  function previewClip(clip: Clip) {
    setSlider('Marker', clip.start)
    player?.seekTo(clip.start)
    setIsPlaying(true)
  }

  async function exportClip(clip: Clip) {
    setProcessing(true)
    setIsPlaying(false)
    const { data: exportedObj, error } = await exportQuery()
    exportedObj && storeObject(exportedObj)
    setProcessing(false)
    // if (error) set error overlay
  }

  const hasReachedEnd = () => getSlider('Marker') >= getSlider('End')

  const togglePlaying = () => setIsPlaying(!isPlaying)

  function getSlider(key: keyof typeof Sliders) {
    return sliderValues[Sliders[key]]
  }

  const setSlider = (key: keyof typeof Sliders, value: number) =>
    setSliderValues((prev) => {
      const sliders = [...prev]
      sliders[Sliders[key]] = value
      return sliders
    })

  const getUpdatedSliderId = (values: number[]) =>
    sliderValues.findIndex((v, i) => v !== values[i])

  function handleSliderChange(values: number[]) {
    setSliderValues(values)
    const sliderId = getUpdatedSliderId(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    player?.seekTo(values[sliderId])
  }

  function handleSliderCommit(values: number[]) {
    setSliderValues(values)
    const sliderId = getUpdatedSliderId(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    if (!isPlaying && sliderId !== Sliders.Marker)
      return player?.seekTo(getSlider('Marker'))
    player?.seekTo(values[sliderId])
  }

  function handleSkipTo(value: number) {
    const start = getSlider('Start')
    const end = getSlider('End')
    if (value < start) value = start
    if (value > end) value = end
    player?.seekTo(value)
    setSlider('Marker', value)
  }

  function handleMoveSlider(step: number, sliderKey: keyof typeof Sliders) {
    if (!player) return
    const duration = player.getDuration()
    let value = getSlider(sliderKey) + step
    if (value < 0) value = 0
    if (value > duration) value = duration
    player?.seekTo(value)
    setSlider(sliderKey, value)
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    if (isPlaying) setSlider('Marker', playedSeconds)
  }

  function handleReady(player: ReactPlayer) {
    setPlayer(player)
    setLoadingPlayer(false)
  }

  function handlePlay() {
    if (hasReachedEnd()) {
      setSlider('Marker', getSlider('Start'))
      player?.seekTo(getSlider('Start'))
    }
    !isPlaying && togglePlaying()
  }

  function handlePause() {
    isPlaying && togglePlaying()
  }

  return (
    <div className={cn('flex w-full flex-col items-center gap-4')}>
      <div
        className={cn(
          'relative aspect-video w-full select-none',
          !isLoadingPlayer ? 'rounded-md border-2 border-brand' : ''
        )}
      >
        {isProcessing && <Loading>Processing...</Loading>}
        {isLoadingPlayer && <Loading />}
        <ReactPlayer
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                controls: 0,
                rel: 0,
                autoplay: Number(isPlaying),
              },
            },
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onReady={handleReady}
          url={video.url}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      {!isLoadingPlayer && player && (
        <div
          className={cn(
            'flex w-full flex-col items-center gap-10',
            isProcessing ? 'disable' : ''
          )}
        >
          <div className="relative flex h-32 w-full justify-center">
            <SliderControls
              handleMoveSlider={handleMoveSlider}
              getSlider={getSlider}
            />
            <PlayerControls
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
          </div>
          <Slider
            max={player.getDuration()}
            step={1}
            value={sliderValues}
            sliderValues={sliderValues}
            minStepsBetweenThumbs={0}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
          />
        </div>
      )}
    </div>
  )
}
