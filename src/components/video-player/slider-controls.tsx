import { getReadableTimestamp } from '@/lib/utils/time'

import { Sliders } from '../ui/slider'

type SliderControlsProps = DefaultProps & {
  handleMoveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  getSlider(key: keyof typeof Sliders): number
  disabled: boolean
}

export const SliderControls = ({
  handleMoveSlider,
  getSlider,
  disabled,
}: SliderControlsProps) => {
  return (
    <div className="absolute left-0 mt-2 grid grid-cols-3 items-center gap-x-2 gap-y-1">
      <div>start:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('Start'))}
      </div>
      <SliderControlsButtons
        disabled={disabled}
        handleMoveSlider={handleMoveSlider}
        sliderKey={'Start'}
      />
      <div>end:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('End'))}
      </div>
      <SliderControlsButtons
        disabled={disabled}
        handleMoveSlider={handleMoveSlider}
        sliderKey={'End'}
      />
      <div>duration:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('End') - getSlider('Start'))}
      </div>
    </div>
  )
}

type SliderControlsButtonsProps = {
  handleMoveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  sliderKey: keyof typeof Sliders
  disabled: boolean
}

const SliderControlsButtons = ({
  handleMoveSlider,
  sliderKey,
  disabled,
}: SliderControlsButtonsProps) => {
  return (
    <div className="flex select-none">
      <button
        disabled={disabled}
        onClick={() => handleMoveSlider(-1, sliderKey)}
        className="panel slider-controls-icon flex items-center justify-center p-0 text-xl"
      >
        -
      </button>
      <button
        disabled={disabled}
        onClick={() => handleMoveSlider(1, sliderKey)}
        className="panel slider-controls-icon flex items-center justify-center p-0 text-xl"
      >
        +
      </button>
    </div>
  )
}
