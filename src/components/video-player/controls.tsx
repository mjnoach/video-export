import { getReadableTimestamp } from '@/lib/utils'

import { Sliders } from '../ui/slider'

import { Pause, Play, Undo2 } from 'lucide-react'
import ReactPlayer from 'react-player'

type ControlsProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
  togglePlaying: () => void
  isPlaying: boolean
}

export const Controls = ({
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

export const SkipForward = ({ player, handleSkipTo, getSlider }: SkipProps) => {
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
