import { useEffect, useRef, useState } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Log, Progress } from '@ffmpeg/types'
import { fetchFile } from '@ffmpeg/util'

export const useClientExport = () => {
  const [progress, setProgress] = useState<null | number>(null)
  const [id, setId] = useState<null | string>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isPending, setPending] = useState(false)
  const [warning, setWarning] = useState<null | string>(null)

  const ffmpegRef = useRef<any>(null)

  useEffect(() => {
    const ffmpeg = new FFmpeg()
    ffmpegRef.current = ffmpeg
    load()
  }, [])

  const load = async () => {
    console.log('Loading...')

    await ffmpegRef.current.load({
      coreURL: `/ffmpeg/esm/ffmpeg-core.js`,
      wasmURL: `/ffmpeg/esm/ffmpeg-core.wasm`,
      workerURL: `/ffmpeg/esm/ffmpeg-core.worker.js`,
    })

    ffmpegRef.current.on('progress', ({ progress, time }: Progress) => {
      console.log('progress, time:', progress, time)
    })
    ffmpegRef.current.on('log', ({ type, message }: Log) => {
      console.log(message)
    })

    console.log('FFmpeg loaded!')
  }

  const transcode = async () => {
    await ffmpegRef.current.writeFile(
      'input.webm',
      await fetchFile(
        'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'
      )
    )
    await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4'])
    const data = await ffmpegRef.current.readFile('output.mp4')
    // videoRef.current.src = URL.createObjectURL(
    //   new Blob([data.buffer], { type: 'video/mp4' })
    // )
  }

  const exportClip = (data: Clip) => {}

  useEffect(() => {
    if (id) {
      // queryClient
      //   .fetchQuery({
      //     queryKey: ['export', id],
      //     queryFn: async () => {
      //       if (!id) throw new Error('Export id is not defined')
      //       const exportData = await api.getExport(id, setProgress)
      //       setData(exportData)
      //     },
      //   })
      //   .catch((e: any) => {
      //     setError(e)
      //   })
      //   .finally(() => {
      //     setPending(false)
      //   })
    }
  }, [id])

  function reset() {
    setId(null)
    setProgress(null)
    setError(null)
    setData(null)
    setPending(false)
    setWarning(null)
  }

  return {
    exportClip,
    progress,
    data,
    reset,
    error: error,
    isSuccess: !!data,
    isError: !!error,
    isPending,
    warning,
  }
}
