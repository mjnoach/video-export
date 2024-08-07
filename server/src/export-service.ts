import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { handleClientSource, handleRemoteSource } from './sources.js'

import { nanoid } from 'nanoid'
import { Readable } from 'stream'

const { EXPORT_DIR } = process.env

type Task = {
  data: ExportData | null
  status: null | 'started' | 'completed' | 'failed'
  onProgress?: (percent: string) => void
  onFinish?: (data: ExportData) => void
  onError?: (err: any) => void
}

const tasks: {
  [id: string]: Task
} = {}

export const exportService = {
  init: async (clip: Clip) => {
    const OBJ_ID_LENGTH = 8
    const id = nanoid(OBJ_ID_LENGTH)
    tasks[id] = {
      data: null,
      status: null,
    }
    return { id }
  },
  get: (id: string) => {
    return tasks[id]
  },
  start: async (id: string, clip: Clip, port: MessagePort) => {
    const { url, start, duration, extension } = clip

    const fileName = `${id}${extension}`
    const filePath = `${EXPORT_DIR}/${fileName}`
    const fileFormat = extension.replace('.', '')

    const targetClip: ExportTarget = {
      id,
      path: filePath,
      format: fileFormat,
      duration,
    }

    let source: string | Readable | null = null
    source = clip.isLocal
      ? await handleClientSource(clip.file, targetClip)
      : await handleRemoteSource(url)

    await transcodeVideo(
      {
        source,
        target: { ...targetClip, start },
      },
      port
    )

    const withThumbnails = false
    const thumbnail =
      withThumbnails && fileFormat === 'mp4'
        ? await generateThumbnail(filePath, id)
        : null

    const exportData = {
      ...targetClip,
      url: `${EXPORT_DIR}/${fileName}`,
      thumbnail,
    }

    return exportData
  },
  report: async (id: string, percent: string) => {
    console.info(`* Processing ${id} ${percent}%`)
    const task = tasks[id]
    task.onProgress?.(percent)
  },
  complete: (id: string, data: ExportData) => {
    const task = tasks[id]
    task.status = 'completed'
    task.onFinish?.(data)
  },
  fail: (id: string, err: Error) => {
    err.constructor.name && console.error(err.constructor.name)
    err.message && console.error(err.message)
    err.cause && console.error(err.cause)
    const task = tasks[id]
    task.status = 'failed'
    task.onError?.(err)
  },
}
