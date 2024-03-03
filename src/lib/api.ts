import ky from 'ky'

export const api = {
  exportClip,
}

async function exportClip(clip: Clip) {
  const res = await ky.post('/api/export-clip', {
    json: clip,
  })
  console.log('🚀 ~ res:', res)
  const data = await res.json()
  console.log('🚀 ~ exportVideo: ~ data:', data)
}
