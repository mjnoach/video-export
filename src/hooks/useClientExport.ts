import { useContext, useState } from 'react'

import { EditorContext } from '@/context/editor'
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
  let { ffmpeg } = useContext(EditorContext) as { ffmpeg: FFmpeg }

  const startProcessing = async ({
    source,
    target,
  }: {
    source: ExportSource
    target: ExportTarget
  }) => {
    let { id, path, start, duration, format } = target
    console.info(`Processing ${id} started...`)
    await ffmpeg.writeFile('input.webm', await fetchFile(source))
    const codecCopy = format === 'mp4' ? ['-c', 'copy'] : []
    const errorCode = await ffmpeg.exec([
      '-i',
      'input.webm',
      '-t',
      `${duration}`,
      '-ss',
      `${start}`,
      '-f',
      format,
      ...codecCopy,
      path,
    ])
    if (errorCode) {
      const message = `Processing '${id}' failed`
      console.error(message)
      throw new Error(message)
    }
    console.info(`Processing ${id} complete!`)
  }

  const exportClip = async (clip: Clip) => {
    setPending(true)

    const id = nanoid(OBJ_ID_LENGTH)
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
      // console.info(`* Processing ${id} ${percent}%`)
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
    isPending,
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
