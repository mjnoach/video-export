import { getReadableTimestamp } from '@/lib/utils/time'

import { Sliders } from '../ui/slider'

type SliderControlsProps = DefaultProps & {
  handleMoveSlider: (step: number, sliderKey: keyof typeof Sliders) => void
  getSlider(key: keyof typeof Sliders): number
}

export const SliderControls = ({
  handleMoveSlider,
  getSlider,
}: SliderControlsProps) => {
  return (
    <div className="absolute left-0 mt-2 grid grid-cols-3 items-center gap-x-2 gap-y-1">
      <div>start:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('Start'))}
      </div>
      <SliderControlsButtons
        handleMoveSlider={handleMoveSlider}
        sliderKey={'Start'}
      />
      <div>end:</div>
      <div className="justify-self-center font-mono">
        {getReadableTimestamp(getSlider('End'))}
      </div>
      <SliderControlsButtons
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
}

const SliderControlsButtons = ({
  handleMoveSlider,
  sliderKey,
}: SliderControlsButtonsProps) => {
  return (
    <div className="flex select-none">
      <button
        onClick={() => handleMoveSlider(-1, sliderKey)}
        className="panel flex h-6 w-6 items-center justify-center p-0 text-xl"
      >
        -
      </button>
      <button
        onClick={() => handleMoveSlider(1, sliderKey)}
        className="panel flex h-6 w-6 items-center justify-center p-0 text-xl"
      >
        +
      </button>
    </div>
  )
}
