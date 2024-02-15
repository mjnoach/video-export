'use client'

import * as React from 'react'

import { cn, getReadableTimestamp } from '@/lib/utils'

import * as SliderPrimitive from '@radix-ui/react-slider'

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
    <Thumb value={sliderValues[0]} />
    <Marker />
    <Thumb value={sliderValues[2]} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

const Thumb = ({ value }: { value: number }) => {
  return (
    <SliderPrimitive.Thumb className="relative">
      <div className="absolute bottom-full flex -translate-x-1/2 cursor-grab flex-col items-center">
        <div>{getReadableTimestamp(value)}</div>
        {'|'}
      </div>
    </SliderPrimitive.Thumb>
  )
}

const Marker = () => {
  return (
    <SliderPrimitive.Thumb className="relative">
      <div className="absolute bottom-full flex -translate-x-1/2 cursor-grab flex-col items-center text-brand">
        <MarkerIcon />
        {'|'}
      </div>
    </SliderPrimitive.Thumb>
  )
}

const MarkerIcon = () => (
  <>
    <div className="relative inset-y-1 h-1 w-2/3 bg-gray-950" />
    <svg
      className="w-5 fill-brand"
      viewBox="-64 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0" />
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z" />
      </g>
    </svg>
  </>
)
