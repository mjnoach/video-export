import fs from 'fs'

const { DATA_DIR } = process.env

export function getTotalSeconds(timemark: string): number {
  if (timemark === 'N/A') return 0
  let [hours, minutes, seconds] = timemark.split(':').map(parseFloat)
  seconds = parseInt(seconds.toFixed())
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  return totalSeconds
}

export function getProgressPercent(
  { timemark }: ProgressData,
  start: number,
  duration: number
) {
  const seconds = getTotalSeconds(timemark)
  const fraction = Math.min(1, seconds / duration)
  const percent = (fraction * 100).toFixed(0)
  return percent
}

export function clearTempData(id: string) {
  const path = `${DATA_DIR}/${id}.mp4`
  fs.promises.unlink(path).catch((err) => {
    console.error(err)
  })
}

export const getFileUrl = (path: string) => new URL(path, import.meta.url)
