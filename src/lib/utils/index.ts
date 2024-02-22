import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sliderValueToVideoTime(duration: number, sliderValue: number) {
  return Math.round((duration * sliderValue) / duration)
}
export function getReadableTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

  return hours
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`
}

export function persist(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function restore(key: string) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}
