import { useEffect, useRef, useState } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Log, Progress } from '@ffmpeg/types'
import { fetchFile } from '@ffmpeg/util'
import { nanoid } from 'nanoid'

export const useClientExport = () => {
  const [progress, setProgress] = useState<null | number>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isPending, setPending] = useState(false)
  const [warning, setWarning] = useState<null | string>(null)
  const [isReady, setReady] = useState(false)

  const ffmpegRef = useRef<FFmpeg | null>(null)

  useEffect(() => {
    const ffmpeg = new FFmpeg()
    ffmpegRef.current = ffmpeg
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async () => {
    console.log('Loading...')
    await ffmpegRef.current!.load({
      coreURL: `/ffmpeg/esm/ffmpeg-core.js`,
      wasmURL: `/ffmpeg/esm/ffmpeg-core.wasm`,
      workerURL: `/ffmpeg/esm/ffmpeg-core.worker.js`,
    })
    console.log('FFmpeg loaded!')
    ffmpegRef.current!.on('log', ({ type, message }: Log) => {
      // console.log('log:', message)
    })
    setReady(true)
  }

  const transcode = async ({
    source,
    target,
  }: {
    source: string | File | Blob
    target: ExportTarget & { start: number }
  }) => {
    let { id, path, start, duration, format } = target
    console.info(`Transcoding ${id} started...`)
    await ffmpegRef.current!.writeFile('input.webm', await fetchFile(source))
    const errorCode = await ffmpegRef.current!.exec([
      '-i',
      'input.webm',
      '-t',
      `${duration}`,
      '-ss',
      `${start}`,
      '-f',
      format,
      path,
    ])
    if (errorCode) {
      const message = `Transcoding '${id}' failed`
      console.error(message)
      throw new Error(message)
    }
    console.info(`Transcoding ${id} complete!`)
  }

  const OBJ_ID_LENGTH = 8

  const exportClip = async (clip: Clip) => {
    setPending(true)

    // const maxDuration = Number(process.env.NEXT_PUBLIC_MAX_CLIP_DURATION)
    // try {
    //   assertMaxDuration(clip, maxDuration)
    // } catch (e) {
    //   setWarning(`Clip duration cannot exceed ${maxDuration} seconds`)
    // }

    const id = nanoid(OBJ_ID_LENGTH)
    const { url, start, duration, extension } = clip

    const fileName = `${id}${extension}`
    const filePath = `${fileName}`
    const fileFormat = extension.replace('.', '')

    const targetClip: ExportTarget = {
      id: id as string,
      path: filePath,
      format: fileFormat,
      duration,
    }

    ffmpegRef.current!.on('progress', ({ progress, time }: Progress) => {
      // TODO
      // progress is relative to the entire duration of the original video
      // it actually shows at which part of the original video the process is at
      console.log('🚀 ~ ffmpegRef.current!.on ~ progress:', progress)
      const percent = (progress * 100).toFixed(0)
      console.info(`* Processing ${id} ${percent}%`)
      setProgress(parseInt(percent))
    })

    try {
      await transcode({ source: url, target: { ...targetClip, start } })

      const data = (await ffmpegRef.current!.readFile(
        targetClip.path
      )) as Uint8Array

      const objUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: getMimeType(fileFormat) })
      )

      const exportData: ExportData = {
        ...targetClip,
        url: objUrl,
        thumbnail: null,
      }

      setData(exportData)
    } catch (e: any) {
      setError(e)
    } finally {
      setPending(false)
    }
  }

  function reset() {
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
    isReady,
  }
}

const getMimeType = (format: string) => {
  return {
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    gif: 'image/gif',
  }[format]
}
