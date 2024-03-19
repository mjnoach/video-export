import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

export const api = {
  postExport: async (clip: Clip) => {
    const res = await ky.post('/api/export', {
      json: clip,
    })
    return res.json<ExportedObj['id']>()
  },
  getExport: async (id: string) => {
    const res = await ky.get(`/api/export?id=${id}`)
    const stream = res.body?.pipeThrough(new TextDecoderStream())

    const reader = stream?.getReader()
    if (!reader) throw new Error('No reader')

    let reading = true
    while (reading) {
      const { value, done } = await reader.read()
      console.log('🚀 ~ export: ~ value:', value)
      reading = !done
    }

    // const source = new EventSource('/api/export')

    // return res.json<ExportedObj>()
  },
}

export const useExport = () => {
  return useMutation({
    // write a custom mutation function that will post data and internally make a secondary get request for the updates and final data
    mutationFn: (data: Clip) => api.postExport(data),
  })
}
