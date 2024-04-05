export const assertMaxDuration = (clip: Clip, maxDuration: number) => {
  if (!maxDuration) return
  const clipDuration = clip.end - clip.start
  if (clipDuration > maxDuration) {
    throw new Error('Maximum clip duration exceeded')
  }
}
