import { useRef } from 'react'

import { cn } from '@/lib/utils'
import { getReadableTimestamp, hasHours } from '@/lib/utils/time'

import { Sliders } from '../ui/slider'

import { useLongPress } from '@uidotdev/usehooks'

type ClipInfoProps = DefaultProps & {
  videoDuration: number
  moveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  getSlider(key: keyof typeof Sliders): number
  disabled: boolean
}

export const ClipInfo = ({
  videoDuration,
  moveSlider,
  getSlider,
  disabled,
}: ClipInfoProps) => {
  let timestampWidth = 'w-18'
  if (hasHours(videoDuration)) timestampWidth = 'w-24'

  return (
    <div className="absolute left-0 top-2 grid select-none items-center gap-y-1">
      <div className="flex">
        <div className="mr-2 w-20">start:</div>
        <div className={cn('text-end font-mono', timestampWidth)}>
          {getReadableTimestamp(getSlider('Start'))}
        </div>
        <Buttons
          disabled={disabled}
          moveSlider={moveSlider}
          sliderKey={'Start'}
        />
      </div>
      <div className="flex">
        <div className="mr-2 w-20">end:</div>
        <div className={cn('text-end font-mono', timestampWidth)}>
          {getReadableTimestamp(getSlider('End'))}
        </div>
        <Buttons
          disabled={disabled}
          moveSlider={moveSlider}
          sliderKey={'End'}
        />
      </div>
      <div className="flex">
        <div className="mr-2 w-20">duration:</div>
        <div className={cn('text-end font-mono', timestampWidth)}>
          {getReadableTimestamp(getSlider('End') - getSlider('Start'))}
        </div>
      </div>
    </div>
  )
}

type ButtonsProps = {
  moveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  sliderKey: keyof typeof Sliders
  disabled: boolean
}

const BUTTON_STEP = 0.1

const Buttons = ({ moveSlider, sliderKey, disabled }: ButtonsProps) => {
  const pressThreshold = 500
  const pressInterval = 50
  const interval = useRef<NodeJS.Timeout>()

  const moveForward = () => moveSlider(BUTTON_STEP, sliderKey)
  const moveBackward = () => moveSlider(-BUTTON_STEP, sliderKey)

  const pressBackward = useLongPress(
    () => (interval.current = setInterval(moveBackward, pressInterval)),
    {
      onFinish: () => clearInterval(interval.current),
      onCancel: moveBackward,
      threshold: pressThreshold,
    }
  )

  const pressForward = useLongPress(
    () => (interval.current = setInterval(moveForward, pressInterval)),
    {
      onFinish: () => clearInterval(interval.current),
      onCancel: moveForward,
      threshold: pressThreshold,
    }
  )

  return (
    <div className="ml-2 flex w-fit select-none gap-2">
      <button
        {...pressBackward}
        disabled={disabled}
        className="panel slider-controls-icon center text-xl"
      >
        -
      </button>
      <button
        {...pressForward}
        disabled={disabled}
        className="panel slider-controls-icon center text-xl"
      >
        +
      </button>
    </div>
  )
}
