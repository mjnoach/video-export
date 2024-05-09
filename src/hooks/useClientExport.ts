import { useEffect, useRef, useState } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Progress } from '@ffmpeg/types'
import { fetchFile } from '@ffmpeg/util'
import { nanoid } from 'nanoid'

const OBJ_ID_LENGTH = 8

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
    setReady(true)
  }

  const transcode = async ({
    source,
    target,
  }: {
    source: ExportSource
    target: ExportTarget
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

  const exportClip = async (clip: Clip) => {
    setPending(true)

    const id = nanoid(OBJ_ID_LENGTH)
    const { url, start, duration, extension } = clip

    const targetClip: ExportTarget = {
      id,
      path: `${id}${extension}`,
      format: extension.replace('.', ''),
      duration,
      start,
    }

    const progressCallback = ({ progress, time }: Progress) => {
      const relativeProgress = (progress * clip.videoLength) / clip.duration
      const percent = parseInt((relativeProgress * 100).toFixed(0))
      console.info(`* Processing ${id} ${percent}%`)
      setProgress(percent)
    }
    ffmpegRef.current!.on('progress', progressCallback)

    try {
      await transcode({ source: url, target: targetClip })

      const data = (await ffmpegRef.current!.readFile(
        targetClip.path
      )) as Uint8Array

      const objUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: getMimeType(targetClip.format) })
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
      ffmpegRef.current!.off('progress', progressCallback)
      setProgress(null)
      setPending(false)
    }
  }

  const reset = () => {
    setError(null)
    setData(null)
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
