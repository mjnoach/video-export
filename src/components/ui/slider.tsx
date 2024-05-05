'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { getReadableTimestamp } from '@/lib/utils/time'

import * as SliderPrimitive from '@radix-ui/react-slider'

export enum Sliders {
  Start,
  Marker,
  End,
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    sliderValues: number[]
  }
>(({ className, sliderValues, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <div className="z-10">
      <Thumb value={sliderValues[Sliders.Start]} />
    </div>
    <div className="z-20">
      <Marker />
    </div>
    <div className="z-10">
      <Thumb value={sliderValues[Sliders.End]} />
    </div>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

const Thumb = ({ value }: { value: number }) => {
  return (
    <SliderPrimitive.Thumb>
      <button className="group absolute bottom-full flex -translate-x-1/2 cursor-grab flex-col items-center">
        <div className="duration-400 mb-1 bg-background font-mono opacity-0 transition ease-in-out group-hover:opacity-100">
          {getReadableTimestamp(value)}
        </div>
        <MarkerIcon className="!fill-white" />
        <div className="relative -bottom-1 h-6 w-0.5 bg-white" />
      </button>
    </SliderPrimitive.Thumb>
  )
}

const Marker = () => {
  return (
    <SliderPrimitive.Thumb>
      <div className="absolute bottom-full flex -translate-x-1/2 cursor-grab flex-col items-center">
        <MarkerIcon />
        <div className="relative -bottom-1 h-6 w-0.5 bg-player" />
      </div>
    </SliderPrimitive.Thumb>
  )
}

const MarkerIcon = ({ className }: DefaultProps) => (
  <svg
    className={cn(className, 'relative inset-y-1.5 w-4 fill-player')}
    viewBox="0 0 384 379"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
  >
    <path
      id="Path"
      d="M172.268 368.67 C26.97 158.031 0 136.413 0 59 0 -47.039 85.961 -133 192 -133 298.039 -133 384 -47.039 384 59 384 136.413 357.03 158.031 211.732 368.67 202.197 382.444 181.802 382.443 172.268 368.67 Z"
      fillOpacity="1"
      stroke="none"
    />
    <defs>
      <image id="image" width="384px" height="379px" />
    </defs>
    <use id="Layer" x="0px" y="0px" width="384px" height="379px" />
  </svg>
)
