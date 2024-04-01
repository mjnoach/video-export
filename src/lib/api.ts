import { useEffect, useState } from 'react'

import { queryClient } from '@/app/providers'
import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

export const useExportRequest = () => {
  const [progress, setProgress] = useState<null | number>(null)
  const [id, setId] = useState<null | string>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isPending, setPending] = useState(false)

  const mutation = useMutation({
    mutationFn: async (data: Clip) => {
      setPending(true)
      const exportId = await api.postExport(data)
      setId(exportId)
    },
  })

  useEffect(() => {
    const fetchQuery = async () => {
      await queryClient
        .fetchQuery({
          queryKey: ['export', id],
          queryFn: async () => {
            if (!id) throw new Error('Export id is not defined')
            const exportData = await api.getExport(id, setProgress)
            setData(exportData)
          },
        })
        .catch((e: any | Error) => {
          setError(e)
        })
      setPending(false)
    }
    id && fetchQuery()
  }, [id])

  function reset() {
    mutation.reset()
    setId(null)
    setProgress(null)
    setError(null)
    setData(null)
  }

  return {
    mutate: mutation.mutate,
    progress,
    data,
    reset,
    error: mutation.error ?? error,
    isSuccess: mutation.isSuccess && !!data,
    isError: mutation.isError || !!error,
    isPending,
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
