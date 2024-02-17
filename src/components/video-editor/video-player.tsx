import { createRef, useContext, useEffect, useState } from 'react'

import { cn, getReadableTimestamp } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import { Slider, Sliders } from '../ui/slider'

import { Pause, Play, Undo2 } from 'lucide-react'
import ReactPlayer from 'react-player'

type VideoPlayerProps = DefaultProps & {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const playerRef = createRef<ReactPlayer>()
  const sliderRef = createRef<HTMLDivElement>()

  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const duration = player?.getDuration() ?? 0
  const [isPlaying, setIsPlaying] = useState(false)
  const togglePlaying = () => setIsPlaying(!isPlaying)
  const src = video.obj ? URL.createObjectURL(video.obj) : video.path
  const [sliderValues, setSliderValues] = useState([0, 0, 0])

  const getSlider = (index: keyof typeof Sliders) =>
    sliderValues[Sliders[index]]

  const setSlider = (index: Sliders, value: number) =>
    setSliderValues((prev) => {
      const sliders = [...prev]
      sliders[index] = value
      return sliders
    })

  const { actions, setActions } = useContext(EditorContext)

  useEffect(() => {
    if (sliderValues[Sliders.Marker] > sliderValues[Sliders.End]) {
      setIsPlaying(false)
    }

    setActions({
      previewVideo: () => {
        setSlider(Sliders.Marker, getSlider('Start'))
        player?.seekTo(getSlider('Start'))
        setIsPlaying(true)
      },
      exportVideo: () => {
        console.log('exporting video')
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, sliderValues])

  useEffect(() => {
    setSliderValues([0, duration / 2, duration])
  }, [duration])

  function determineActiveSlider(values: number[]) {
    const activeSlider = values.findIndex((v, i) => v !== sliderValues[i])
    return activeSlider
  }

  function handleSliderChange(values: number[]) {
    setSliderValues(values)
    const sliderId = determineActiveSlider(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    player?.seekTo(values[sliderId])
  }

  function handleSkipTo(value: number) {
    player?.seekTo(value)
    setSlider(Sliders.Marker, value)
  }

  function handlePlay() {
    player?.seekTo(getSlider('Marker'))
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    if (isPlaying) setSlider(Sliders.Marker, playedSeconds)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={cn(
          'aspect-video overflow-clip rounded-md',
          player !== null ? 'border-2 border-brand' : ''
        )}
      >
        <ReactPlayer
          onProgress={handleProgress}
          onPlay={handlePlay}
          ref={playerRef}
          onReady={(player) => setPlayer(player)}
          className="react-player"
          url={src}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-16">
        {player && (
          <>
            <Controls
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
            <Slider
              ref={sliderRef}
              max={duration}
              step={1}
              disabled={!player}
              value={sliderValues}
              sliderValues={sliderValues}
              minStepsBetweenThumbs={1}
              onValueChange={handleSliderChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

type ControlsProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
  togglePlaying: () => void
  isPlaying: boolean
}

const Controls = ({
  player,
  handleSkipTo,
  getSlider,
  togglePlaying,
  isPlaying,
}: ControlsProps) => {
  return (
    <div className="flex select-none flex-col items-center gap-4">
      <div className="flex">
        <SkipBackwards
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
        <div className="hover-panel cursor-pointer p-2" onClick={togglePlaying}>
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </div>
        <SkipForward
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
      </div>
      {/* <p className="-mt-2 text-xs text-gray-500 dark:text-gray-400">spacebar</p> */}
      <div className="text-brand">
        {getReadableTimestamp(getSlider('Marker'))}
      </div>
    </div>
  )
}

const SKIP = 5

type SkipProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
}

const SkipBackwards = ({ handleSkipTo, getSlider }: SkipProps) => {
  const value = Math.max(
    getSlider('Start'),
    Math.max(getSlider('Marker') - SKIP, 0)
  )

  return (
    <div
      onClick={() => handleSkipTo(value)}
      className="hover-panel relative cursor-pointer p-2"
    >
      <div className="absolute right-2 top-1 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8" />
    </div>
  )
}

const SkipForward = ({ player, handleSkipTo, getSlider }: SkipProps) => {
  const value = Math.min(
    getSlider('End'),
    Math.min(getSlider('Marker') + SKIP, player.getDuration())
  )

  return (
    <div
      onClick={() => handleSkipTo(value)}
      className="hover-panel relative cursor-pointer p-2"
    >
      <div className="absolute left-2 top-1 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8 scale-x-[-1]" />
    </div>
  )
}
