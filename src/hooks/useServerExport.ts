import { useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { assertMaxDuration } from '@/lib/validation'

import { queryClient } from '@/app/providers'
import { useMutation } from '@tanstack/react-query'

export const useServerExport = () => {
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
        .catch((e: any) => {
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
    exportClip: mutation.mutate,
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
