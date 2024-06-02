import { useContext, useState } from 'react'

import { EditorContext } from '@/context/editor'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Progress } from '@ffmpeg/types'
import { fetchFile } from '@ffmpeg/util'
import { nanoid } from 'nanoid'

const OBJ_ID_SIZE = 8

export const useClientExport = () => {
  const [progress, setProgress] = useState<null | number>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [error, setError] = useState<null | Error>(null)
  const [isProcessing, setProcessing] = useState(false)
  const [warning, setWarning] = useState<null | string>(null)
  let { ffmpeg } = useContext(EditorContext) as { ffmpeg: FFmpeg }

  const startProcessing = async ({
    source,
    target,
  }: {
    source: ExportSource
    target: ExportTarget
  }) => {
    let { id, path, start, duration, format } = target
    const fileData = await fetchFile(source).catch((e) => {
      throw new Error('File data stored in the browser has expired.')
    })
    await ffmpeg.writeFile('input.webm', fileData)
    const codecCopy = format === 'mp4' ? ['-c', 'copy'] : []
    const errorCode = await ffmpeg.exec([
      '-ss',
      `${start}`,
      '-i',
      'input.webm',
      '-t',
      `${duration}`,
      '-f',
      format,
      ...codecCopy,
      path,
    ])
    if (errorCode) {
      throw new Error(`File processing has failed.`)
    }
  }

  const exportClip = async (clip: Clip) => {
    setProcessing(true)

    const id = nanoid(OBJ_ID_SIZE)
    const { url, start, duration, format } = clip

    const targetClip: ExportTarget = {
      id,
      path: `${id}.${format}`,
      format,
      duration,
      start,
    }

    const progressCallback = ({ progress, time }: Progress) => {
      const relativeProgress = (progress * clip.videoLength) / clip.duration
      const percent = parseInt((relativeProgress * 100).toFixed(0))
      setProgress(percent)
    }
    ffmpeg.on('progress', progressCallback)

    try {
      await startProcessing({ source: url, target: targetClip })

      const data = (await ffmpeg.readFile(targetClip.path)) as Uint8Array

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
      ffmpeg.off('progress', progressCallback)
      setProgress(null)
      setProcessing(false)
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
    isProcessing,
    warning,
  }
}

const getMimeType = (format: string) => {
  return {
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    gif: 'image/gif',
  }[format]
}
