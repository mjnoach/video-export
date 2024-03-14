export function getReadableTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const fHours = hours.toString().padStart(2, '0')
  const fMinutes = minutes.toString().padStart(2, '0')
  const fSeconds = remainingSeconds.toString().padStart(2, '0')

  return hours ? `${fHours}:${fMinutes}:${fSeconds}` : `${fMinutes}:${fSeconds}`
}

export function getReadableDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  let fHours = hours.toFixed(0)
  let fMinutes = minutes.toFixed(0)
  let fSeconds = remainingSeconds.toFixed(0)

  if (minutes) fSeconds = fSeconds.padStart(2, '0')
  if (hours) fMinutes = fMinutes.padStart(2, '0')

  return hours
    ? `${fHours}:${fMinutes}:${fSeconds}s`
    : minutes
      ? `${fMinutes}:${fSeconds}s`
      : `${fSeconds}s`
}

export const parseSeconds = (timemark: string) => {
  const secondsStr = timemark.split(':').at(-1) as string
  let seconds = parseInt(secondsStr)
  return isNaN(seconds) ? 0 : seconds
}
