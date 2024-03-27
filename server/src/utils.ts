import fs from 'fs'

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
  let fraction = seconds / duration
  if (fraction > 1) fraction = 1
  const percent = (fraction * 100).toFixed(0)
  return percent
}

export function clearTempData(path: string) {
  fs.promises.unlink(path).catch((err) => {
    console.error(err)
  })
}
