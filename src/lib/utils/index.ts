import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const UPLOAD_FORMATS = ['mp4', 'mov']

export const EXPORT_FORMATS = ['mp4', 'mp3', 'gif']
