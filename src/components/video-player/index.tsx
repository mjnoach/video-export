import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

import { useExport } from '@/lib/api'
import { cn } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import { Overlay } from '../overlay'
import { Progress } from '../ui/progress'
import { Slider, Sliders } from '../ui/slider'
import { PlayerControls } from './player-controls'
import { SliderControls } from './slider-controls'

import { LucideLink } from 'lucide-react'
import ReactPlayer from 'react-player/lazy'

type VideoPlayerProps = DefaultProps & {
  video: SourceVideo
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isLoadingPlayer, setLoadingPlayer] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValues, setSliderValues] = useState([0, 0, 0])

  const { setActions, isDisabled, setDisabled, storeObject, clip, updateClip } =
    useContext(EditorContext)

  const { exportRequest, exportProgress } = useExport()

  useEffect(() => {
    if (exportRequest.isError) {
      setTimeout(() => {
        exportRequest.reset()
        setDisabled(false)
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportRequest.isError])

  useEffect(() => {
    if (exportRequest.isSuccess) {
      storeObject(exportRequest.data)
      setTimeout(() => {
        exportRequest.reset()
        setDisabled(false)
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportRequest.isSuccess])

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
    setActions(actions)

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

  const actions: EditorActions = {
    previewClip: (clip: Clip) => {
      setSlider('Marker', clip.start)
      player?.seekTo(clip.start)
      setIsPlaying(true)
    },
    exportClip: async (clip: Clip) => {
      setSlider('Marker', clip.start)
      player?.seekTo(clip.start)
      setDisabled(true)
      setIsPlaying(false)
      exportRequest.mutate(clip)
    },
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

  function moveSlider(step: number, sliderKey: keyof typeof Sliders) {
    if (!player) return
    setSliderValues((prev) => {
      const duration = player.getDuration()
      const sliders = [...prev]
      const value = sliders[Sliders[sliderKey]] + step
      if (value < 0 || value > duration) return sliders
      sliders[Sliders[sliderKey]] = value
      player?.seekTo(value)
      return sliders
    })
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
          !isLoadingPlayer ? 'rounded-md border-4 border-secondary-1' : ''
        )}
      >
        {exportRequest.isPending && (
          <Overlay type={'loading'} title="Processing...">
            {exportProgress ? `${exportProgress}%` : 'initializing'}
            <Progress
              value={Number(exportProgress)}
              className="absolute -bottom-8 h-1 w-[200%]"
            />
          </Overlay>
        )}
        {exportRequest.isError && (
          <Overlay type={'error'} title="Error">
            {exportRequest.error.message}
          </Overlay>
        )}
        {exportRequest.isSuccess && (
          <Overlay type={'success'} title="Export complete!">
            <Link
              href={exportRequest.data.url}
              className="flex items-center gap-2"
              target="_blank"
            >
              <LucideLink className="w-5 text-primary-2" />
              {`${exportRequest.data.id}.${exportRequest.data.format}`}
            </Link>
          </Overlay>
        )}
        {isLoadingPlayer && <Overlay type={'loading'}></Overlay>}
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
            isDisabled ? 'disable' : ''
          )}
        >
          <div className="relative flex h-32 w-full justify-center">
            <SliderControls
              disabled={isDisabled}
              moveSlider={moveSlider}
              getSlider={getSlider}
            />
            <PlayerControls
              disabled={isDisabled}
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
          </div>
          <Slider
            disabled={isDisabled}
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
