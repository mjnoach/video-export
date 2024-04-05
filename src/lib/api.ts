import { useEffect, useState } from 'react'

import { assertMaxDuration } from './validation'

import { queryClient } from '@/app/providers'
import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

export const useExportRequest = () => {
  const [progress, setProgress] = useState<null | number>(null)
  const [id, setId] = useState<null | string>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isPending, setPending] = useState(false)
  const [warning, setWarning] = useState<null | string>(null)

  const mutation = useMutation({
    mutationFn: async (data: Clip) => {
      const maxDuration = Number(process.env.NEXT_PUBLIC_MAX_CLIP_DURATION)
      try {
        assertMaxDuration(data, maxDuration)
      } catch (e) {
        setWarning(`Clip duration cannot exceed ${maxDuration} seconds`)
      }
      setPending(true)
      const exportId = await api.postExport(data)
      setId(exportId)
    },
  })

  useEffect(() => {
    // const fetchQuery = async () => {
    //   if (!id) throw new Error('Export id is not defined')
    //   const exportData = await api
    //     .getExport(id, setProgress)
    //     .catch((e: any | Error) => {
    //       setError(e)
    //     })
    //   exportData && setData(exportData)
    //   setPending(false)
    // }
    // id && fetchQuery()
    if (id) {
      queryClient
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
        .finally(() => {
          setPending(false)
        })
    }
  }, [id])

  function reset() {
    mutation.reset()
    setId(null)
    setProgress(null)
    setError(null)
    setData(null)
    setPending(false)
    setWarning(null)
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
    warning,
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
    let reading = true

    while (reading) {
      let { value, done } = await reader.read()
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

    if (!data) throw new Error(`Streaming response data failed`)

    return data
  },
}
