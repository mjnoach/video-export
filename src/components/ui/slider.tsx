'use client'

import * as React from 'react'

import { cn, getReadableTimestamp } from '@/lib/utils'

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
    <Thumb value={sliderValues[Sliders.Start]} />
    <Marker />
    <Thumb value={sliderValues[Sliders.End]} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

const Thumb = ({ value }: { value: number }) => {
  return (
    <SliderPrimitive.Thumb className="relative">
      <div className="absolute bottom-full z-20 flex -translate-x-1/2 cursor-grab flex-col items-center">
        <div>{getReadableTimestamp(value)}</div>
        <div className="text-3xl">{'|'}</div>
      </div>
    </SliderPrimitive.Thumb>
  )
}

const Marker = () => {
  return (
    <SliderPrimitive.Thumb className="relative">
      <div className="absolute bottom-full flex -translate-x-1/2 cursor-grab flex-col items-center text-brand">
        <MarkerIcon />
        <div className="">{'|'}</div>
      </div>
    </SliderPrimitive.Thumb>
  )
}

const MarkerIcon = () => (
  <svg
    className="relative inset-y-1 w-4 fill-brand"
    viewBox="0 0 384 379"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
  >
    <path
      id="Path"
      d="M172.268 368.67 C26.97 158.031 0 136.413 0 59 0 -47.039 85.961 -133 192 -133 298.039 -133 384 -47.039 384 59 384 136.413 357.03 158.031 211.732 368.67 202.197 382.444 181.802 382.443 172.268 368.67 Z"
      fill-opacity="1"
      stroke="none"
    />
    <defs>
      <image id="image" width="384px" height="379px" />
    </defs>
    <use id="Layer" x="0px" y="0px" width="384px" height="379px" />
  </svg>
)
