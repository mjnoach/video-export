import { cn, getReadableTimestamp } from '@/lib/utils'

import { Sliders } from '../ui/slider'

import { Pause, Play, Undo2 } from 'lucide-react'
import type ReactPlayer from 'react-player'

type ControlsProps = {
  disabled: boolean
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
  togglePlaying: () => void
  isPlaying: boolean
}

export const Controls = ({
  disabled,
  player,
  handleSkipTo,
  getSlider,
  togglePlaying,
  isPlaying,
}: ControlsProps) => {
  return (
    <div className="flex select-none flex-col items-center gap-2">
      <div className="flex">
        <SkipBackwards
          disabled={disabled}
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
        <button
          disabled={disabled}
          className="hover-blur-panel p-2"
          onClick={togglePlaying}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </button>
        <SkipForward
          disabled={disabled}
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
      </div>
      {/* <p className="-mt-2 text-xs text-gray-500 dark:text-gray-400">spacebar</p> */}
      <div className={cn('text-brand', disabled ? 'opacity-20' : '')}>
        {getReadableTimestamp(getSlider('Marker'))}
      </div>
    </div>
  )
}

const SKIP = 5

type SkipProps = {
  disabled: boolean
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
}

const SkipBackwards = ({ disabled, handleSkipTo, getSlider }: SkipProps) => {
  const value = Math.max(
    getSlider('Start'),
    Math.max(getSlider('Marker') - SKIP, 0)
  )

  return (
    <button
      disabled={disabled}
      onClick={() => handleSkipTo(value)}
      className="hover-blur-panel relative p-2"
    >
      <div className="absolute right-2 top-1 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8" />
    </button>
  )
}

export const SkipForward = ({
  disabled,
  player,
  handleSkipTo,
  getSlider,
}: SkipProps) => {
  const value = Math.min(
    getSlider('End'),
    Math.min(getSlider('Marker') + SKIP, player.getDuration())
  )

  return (
    <button
      disabled={disabled}
      onClick={() => handleSkipTo(value)}
      className="hover-blur-panel relative p-2"
    >
      <div className="absolute left-2 top-1 text-xs">{SKIP}</div>
      <Undo2 className="h-8 w-8 scale-x-[-1]" />
    </button>
  )
}
