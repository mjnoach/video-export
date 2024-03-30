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

async function parseToFormData(clip: Clip) {
  const formData = new FormData()
  formData.append('clip', JSON.stringify(clip))
  const blob = await (await fetch(clip.url)).blob()
  formData.append(
    'file',
    new File([blob], clip.title, {
      type: 'video/mp4',
    })
  )
  return formData
}

const api = {
  postExport: async (clip: Clip) => {
    const res = await ky.post(
      '/api/export',
      clip.isClientUpload
        ? { body: await parseToFormData(clip) }
        : { json: clip }
    )
    return res.json<ExportData['id']>()
  },
  getExport: async (id: string, setProgress: (progress: string) => void) => {
    const res = await ky.get(`/api/export?id=${id}`)
    const stream = res.body?.pipeThrough(new TextDecoderStream())
    const reader = stream?.getReader()

    if (!reader) throw new Error('No reader')

    let data: ExportData | null = null
    // let error: ExportError | null = null
    let reading = true
    while (reading) {
      let { value, done } = await reader.read()
      // if (value?.startsWith('error:')) {
      //   error = value.replace('error:', '') as ExportError
      //   break
      // }
      if (value?.startsWith('data:')) {
        data = JSON.parse(value.replace('data:', '')) as ExportData
        break
      }
      if (value) {
        value = parseInt(value) === 100 ? 'Finalizing' : `${value}%`
        setProgress(value)
      }
      reading = !done
    }

    // if (error) throw new Error(error)
    if (!data) throw new Error(`Streaming response data failed`)

    return data
  },
}
