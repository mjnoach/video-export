import { getReadableTimestamp } from '@/lib/utils/time'

import { Sliders } from '../ui/slider'

import { Pause, Play, Undo2 } from 'lucide-react'
import type ReactPlayer from 'react-player'

type PlayerControlsProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
  togglePlaying: () => void
  isPlaying: boolean
}

export const PlayerControls = ({
  player,
  handleSkipTo,
  getSlider,
  togglePlaying,
  isPlaying,
}: PlayerControlsProps) => {
  return (
    <div className="flex select-none flex-col items-center gap-2">
      <div className="flex">
        <SkipBackwards
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
        <button className="panel p-2" onClick={togglePlaying}>
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </button>
        <SkipForward
          player={player}
          getSlider={getSlider}
          handleSkipTo={handleSkipTo}
        />
      </div>
      <div className={'text-player'}>
        {getReadableTimestamp(getSlider('Marker'))}
      </div>
    </div>
  )
}

const SKIP_STEP = 5

type SkipProps = {
  player: ReactPlayer
  handleSkipTo: (value: number) => void
  getSlider: (index: keyof typeof Sliders) => number
}

const SkipBackwards = ({ handleSkipTo, getSlider }: SkipProps) => {
  const value = Math.max(
    getSlider('Start'),
    Math.max(getSlider('Marker') - SKIP_STEP, 0)
  )

  return (
    <button onClick={() => handleSkipTo(value)} className="panel relative p-2">
      <div className="absolute right-2 top-1 text-xs">{SKIP_STEP}</div>
      <Undo2 className="h-8 w-8" />
    </button>
  )
}

export const SkipForward = ({ player, handleSkipTo, getSlider }: SkipProps) => {
  const value = Math.min(
    getSlider('End'),
    Math.min(getSlider('Marker') + SKIP_STEP, player.getDuration())
  )

  return (
    <button onClick={() => handleSkipTo(value)} className="panel relative p-2">
      <div className="absolute left-2 top-1 text-xs">{SKIP_STEP}</div>
      <Undo2 className="h-8 w-8 scale-x-[-1]" />
    </button>
  )
}
