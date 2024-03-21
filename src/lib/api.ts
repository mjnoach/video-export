import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

export const useExport = () => {
  const [progress, setProgress] = useState<null | string>(null)

  const mutation = useMutation({
    mutationFn: async (data: Clip) => {
      const exportId = await api.postExport(data)
      const exportData = await api.getExport(exportId, setProgress)
      return exportData
    },
  })

  function reset() {
    setProgress(null)
    mutation.reset()
  }

  return {
    exportRequest: { ...mutation, reset },
    exportProgress: progress,
  }
}

const api = {
  postExport: async (clip: Clip) => {
    const res = await ky.post('/api/export', {
      json: clip,
    })
    return res.json<ExportedObj['id']>()
  },
  getExport: async (id: string, setProgress: (progress: string) => void) => {
    const res = await ky.get(`/api/export?id=${id}`)
    const stream = res.body?.pipeThrough(new TextDecoderStream())

    const reader = stream?.getReader()
    if (!reader) throw new Error('No reader')

    let data: ExportedObj | null = null
    let reading = true
    while (reading) {
      const { value, done } = await reader.read()
      if (value?.startsWith('data:')) {
        data = JSON.parse(value.replace('data:', '')) as ExportedObj
        break
      }
      if (value) setProgress(value)
      reading = !done
    }

    if (!data) throw new Error(`Streaming export data failed`)

    // const source = new EventSource('/api/export')

    return data
  },
}
