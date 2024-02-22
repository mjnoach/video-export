import { useContext, useEffect, useState } from 'react'

import { cutVideo } from '@/lib/ffmpeg'
import { cn } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import { Loading } from '../loading'
import { Slider, Sliders } from '../ui/slider'
import { Controls } from './controls'

import ReactPlayer from 'react-player/lazy'

type VideoPlayerProps = DefaultProps & {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const src = (
    video.obj ? URL.createObjectURL(video.obj) : video.path
  ) as string
  const [sliderValues, setSliderValues] = useState([0, 0, 0])

  const { actions, setActions, disabled, setDisabled, storeVideo } =
    useContext(EditorContext)

  useEffect(() => {
    if (hasReachedEnd()) setIsPlaying(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues])

  useEffect(() => {
    player && setSliderValues([0, 0, player.getDuration()])

    setActions({
      previewVideo: () => {
        setSlider('Marker', getSlider('Start'))
        player?.seekTo(getSlider('Start'))
        setIsPlaying(true)
      },

      exportVideo: async () => {
        console.log('🚀 ~ exportVideo: ~ exportVideo:')
        setIsPlaying(false)
        setDisabled(true)
        const dataUrl = await cutVideo(
          src,
          getSlider('Start'),
          getSlider('End')
        )
        console.log('🚀 ~ exportVideo: ~ dataUrl:', dataUrl)
        await storeVideo({
          url: dataUrl,
        })
        setDisabled(false)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  const hasReachedEnd = () => getSlider('Marker') >= getSlider('End')

  const togglePlaying = () => setIsPlaying(!isPlaying)

  const getSlider = (key: keyof typeof Sliders) => sliderValues[Sliders[key]]

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
    player?.seekTo(value)
    setSlider('Marker', value)
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    if (isPlaying) setSlider('Marker', playedSeconds)
  }

  function handleReady(player: ReactPlayer) {
    setPlayer(player)
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
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={cn(
          disabled ? 'pointer-events-none' : '',
          'relative aspect-video w-full overflow-clip rounded-md',
          player !== null ? 'border-2 border-brand' : ''
        )}
      >
        {disabled && (
          <Loading>
            <h1 className="text-xl">Processing video export...</h1>
          </Loading>
        )}
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
          url={src}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-10">
        {player && (
          <>
            <Controls
              disabled={disabled}
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
            <Slider
              max={player.getDuration()}
              step={1}
              disabled={disabled}
              value={sliderValues}
              sliderValues={sliderValues}
              minStepsBetweenThumbs={1}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
            />
          </>
        )}
      </div>
    </div>
  )
}
