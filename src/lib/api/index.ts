import ky from 'ky'

export const api = {
  exportClip,
}

async function exportClip(clip: Clip) {
  console.log('🚀 ~ exportClip ~ clip:', clip)
  const res = await ky.post('/api/export-clip', {
    json: clip,
  })
  const data = await res.json<{
    fileName: string
    filePath: string
  }>()
  console.log('🚀 ~ exportVideo: ~ data:', data)
  return data
}
