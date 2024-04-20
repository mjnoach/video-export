export const assertMaxDuration = (clip: Clip, maxDuration: number) => {
  if (!maxDuration) return
  if (clip.duration > maxDuration) {
    throw new Error('Maximum clip duration exceeded')
  }
}
