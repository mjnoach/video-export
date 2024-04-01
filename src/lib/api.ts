import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import ky from 'ky'

export const useExport = () => {
  const [progress, setProgress] = useState<null | number>(null)

  const mutation = useMutation({
    mutationFn: async (data: Clip) => {
      const exportId = await api.postExport(data)
      return exportId
    },
  })

  const query = useQuery({
    queryKey: ['todo', 7],
    queryFn: async () => {
      const exportId = mutation.data as string
      const exportData = await api.getExport(exportId, setProgress)
      return exportData
    },
    enabled: false,
  })

  useEffect(() => {
    query.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isSuccess])

  function reset() {
    setProgress(null)
    mutation.reset()
  }

  return {
    mutate: mutation.mutate,
    progress,
    data: query.data,
    reset,
    error: mutation.error || query.error,
    isSuccess: mutation.isSuccess && query.isSuccess,
    isError: mutation.isError && query.isError,
    isPending: mutation.isPending && query.isPending,
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
  getExport: async (id: string, setProgress: (progress: number) => void) => {
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
      if (value) setProgress(parseInt(value))
      reading = !done
    }

    // if (error) throw new Error(error)
    if (!data) throw new Error(`Streaming response data failed`)

    return data
  },
}
