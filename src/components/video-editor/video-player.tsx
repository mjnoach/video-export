import { createRef, useEffect, useState } from 'react'

import { getReadableTimestamp } from '@/lib/utils'

import { Slider } from '../ui/slider'

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
  const [sliderValues, setSliderValues] = useState([0, 0, 0])
  const markerTime = sliderValues[1]
  console.log('🚀 ~ VideoPlayer ~ markerTime:', markerTime)
  const [isPlaying, setIsPlaying] = useState(false)
  const togglePlaying = () => setIsPlaying(!isPlaying)
  const src = video.obj ? URL.createObjectURL(video.obj) : video.path

  const controlsBounds = {
    min: sliderValues[0],
    max: sliderValues[2],
  }

  useEffect(() => {
    setSliderValues([0, duration / 2, duration])
  }, [duration])

  function determineActiveThumbId(values: number[]) {
    const activeThumb = values.findIndex((v, i) => v !== sliderValues[i])
    return activeThumb
  }

  function handleSliderChange(values: number[]) {
    setSliderValues(values)
    const thumbId = determineActiveThumbId(values)
    player?.seekTo(values[thumbId])
  }

  function handleSkipTo(value: number) {
    player?.seekTo(value)
    setSliderValues([sliderValues[0], value, sliderValues[2]])
  }

  function handlePlay() {
    // if (!player) return
    // const currentmarkerTime = player.getCurrentTime()
    // if (markerTime !== currentmarkerTime)
    player?.seekTo(markerTime)
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    if (playedSeconds !== 0 && markerTime !== playedSeconds)
      setSliderValues([controlsBounds.min, playedSeconds, controlsBounds.max])
  }

  function handleSeek(value: number) {
    // console.log('🚀 ~ VideoPlayer ~ e:', e)
    setSliderValues([controlsBounds.min, value, controlsBounds.max])
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="overflow-clip rounded-md border-2 border-brand">
        <ReactPlayer
          // onSeek={handleSeek}
          // onProgress={handleProgress}
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
              markerTime={markerTime}
              controlsBounds={controlsBounds}
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
  markerTime: number
  controlsBounds: {
    min: number
    max: number
  }
  togglePlaying: () => void
  isPlaying: boolean
}

const Controls = ({
  player,
  handleSkipTo,
  markerTime,
  controlsBounds,
  togglePlaying,
  isPlaying,
}: ControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 ">
      <div className="flex gap-4">
        <SkipBackwards
          player={player}
          markerTime={markerTime}
          controlsBounds={controlsBounds}
          handleSkipTo={handleSkipTo}
        />
        {isPlaying ? (
          <Pause className="h-8 w-8 cursor-pointer" onClick={togglePlaying} />
        ) : (
          <Play className="h-8 w-8 cursor-pointer" onClick={togglePlaying} />
        )}
        <SkipForward
          player={player}
          markerTime={markerTime}
          controlsBounds={controlsBounds}
          handleSkipTo={handleSkipTo}
        />
      </div>
      {/* <p className="-mt-2 text-xs text-gray-500 dark:text-gray-400">spacebar</p> */}
      <div className="text-brand">{getReadableTimestamp(markerTime)}</div>
    </div>
  )
}

const SKIP = 5

type SkipProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  markerTime: number
  controlsBounds: {
    min: number
    max: number
  }
}

const SkipBackwards = ({
  handleSkipTo,
  markerTime,
  controlsBounds: { min },
}: SkipProps) => {
  const value = Math.max(min, Math.max(markerTime - SKIP, 0))

  return (
    <div onClick={() => handleSkipTo(value)} className="relative">
      <div className="absolute -top-2 right-0 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8 cursor-pointer" />
    </div>
  )
}

const SkipForward = ({
  player,
  handleSkipTo,
  markerTime,
  controlsBounds: { max },
}: SkipProps) => {
  const value = Math.min(max, Math.min(markerTime + SKIP, player.getDuration()))

  return (
    <div onClick={() => handleSkipTo(value)} className="relative">
      <div className="left-0-0 absolute -top-2 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8 scale-x-[-1] cursor-pointer" />
    </div>
  )
}
