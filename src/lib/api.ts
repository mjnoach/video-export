import { parseToFormData } from './utils/api'

import ky from 'ky'

export const api = {
  downloadClip: async (clip: Clip) => {
    const res = await ky.get(`/api/download?url=${clip.url}`)
    return await res.blob()
  },
  postExport: async (clip: Clip) => {
    const res = await ky.post(
      '/api/export',
      clip.isLocal ? { body: await parseToFormData(clip) } : { json: clip }
    )
    return res.json<ExportData['id']>()
  },
  getExport: async (id: string, setProgress: (progress: number) => void) => {
    const res = await ky.get(`/api/export?id=${id}`)
    const stream = res.body?.pipeThrough(new TextDecoderStream())
    const reader = stream?.getReader()

    if (!reader) throw new Error('No reader')

    let data: ExportData | null = null
    let error: string | null = null
    let reading = true

    while (reading) {
      let { value, done } = await reader.read()

      const errorKey = 'error:'
      if (value?.includes(errorKey)) {
        error = value.substring(value?.indexOf(errorKey) + errorKey.length)
        break
      }

      const dataKey = 'data:'
      if (value?.includes(dataKey)) {
        const dataStr = value.substring(
          value?.indexOf(dataKey) + dataKey.length
        )
        data = JSON.parse(dataStr) as ExportData
        break
      }

      if (value) setProgress(parseInt(value))
      reading = !done
    }

    if (error) throw new Error(error)
    if (!data) throw new Error(`Export failed`)

    return data
  },
}
