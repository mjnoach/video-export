export function getReadableTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const deciseconds = Math.floor((seconds - Math.floor(seconds)) * 10)

  const fHours = hours.toString().padStart(2, '0')
  const fMinutes = minutes.toString().padStart(2, '0')
  const fSeconds = remainingSeconds.toString().padStart(2, '0')
  const fDeciseconds = deciseconds.toString()

  return hours
    ? `${fHours}:${fMinutes}:${fSeconds}.${fDeciseconds}`
    : `${fMinutes}:${fSeconds}.${fDeciseconds}`
}

export function hasHours(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  return !!hours
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

// export const parseSeconds = (timemark: string) => {
//   const secondsStr = timemark.split(':').at(-1) as string
//   let seconds = parseInt(secondsStr)
//   return isNaN(seconds) ? 0 : seconds
// }

// export function getTotalSeconds(timemark: string): number {
//   if (timemark === 'N/A') return 0
//   let [hours, minutes, seconds] = timemark.split(':').map(parseFloat)
//   seconds = parseInt(seconds.toFixed())
//   const totalSeconds = hours * 3600 + minutes * 60 + seconds
//   return totalSeconds
// }
