import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { handleClientUpload, handleRemoteStream } from './sources.js'

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
  start: async (id: string, clip: Clip | string, file: File) => {
    if (typeof clip === 'string') clip = JSON.parse(clip) as Clip
    const { url, start, end, extension, isClientUpload } = clip

    const fileName = `${id}${extension}`
    const filePath = `${EXPORT_DIR}/${fileName}`
    const fileFormat = extension.replace('.', '')
    const duration = end - start

    const targetClip: ExportTarget = {
      id,
      path: filePath,
      format: fileFormat,
      duration,
    }

    let source: string | Readable | null = null
    source = isClientUpload
      ? await handleClientUpload(file, targetClip)
      : await handleRemoteStream(url)

    await transcodeVideo({
      source,
      target: { ...targetClip, start },
    })

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
