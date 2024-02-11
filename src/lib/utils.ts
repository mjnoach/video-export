import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sliderValueToVideoTime(duration: number, sliderValue: number) {
  return Math.round((duration * sliderValue) / 100)
}
