import { useRef } from 'react'

import { getReadableTimestamp } from '@/lib/utils/time'

import { Sliders } from '../ui/slider'

import { useLongPress } from '@uidotdev/usehooks'

type ClipInfoProps = DefaultProps & {
  moveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  getSlider(key: keyof typeof Sliders): number
  disabled: boolean
}

export const ClipInfo = ({
  moveSlider,
  getSlider,
  disabled,
}: ClipInfoProps) => {
  return (
    <div className="absolute left-0 top-2 grid grid-cols-3 items-center gap-x-2 gap-y-1">
      <div>start:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('Start'))}
      </div>
      <Buttons
        disabled={disabled}
        moveSlider={moveSlider}
        sliderKey={'Start'}
      />
      <div>end:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('End'))}
      </div>
      <Buttons disabled={disabled} moveSlider={moveSlider} sliderKey={'End'} />
      <div>duration:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('End') - getSlider('Start'))}
      </div>
    </div>
  )
}

type ButtonsProps = {
  moveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  sliderKey: keyof typeof Sliders
  disabled: boolean
}

const Buttons = ({ moveSlider, sliderKey, disabled }: ButtonsProps) => {
  const pressThreshold = 500
  const pressInterval = 50
  const step = 1
  const interval = useRef<NodeJS.Timeout>()

  const moveForward = () => moveSlider(step, sliderKey)
  const moveBackward = () => moveSlider(-step, sliderKey)

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
    <div className="flex select-none">
      <button
        {...pressBackward}
        disabled={disabled}
        className="panel slider-controls-icon center p-0 text-xl"
      >
        -
      </button>
      <button
        {...pressForward}
        disabled={disabled}
        className="panel slider-controls-icon center p-0 text-xl"
      >
        +
      </button>
    </div>
  )
}
