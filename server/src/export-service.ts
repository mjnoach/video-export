import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { handleClientUpload, handleRemoteStream } from './sources.js'
import { clearTempData } from './utils.js'

import { nanoid } from 'nanoid'
import { Readable } from 'stream'

const { EXPORT_DIR } = process.env

type Task = {
  data: ExportData | null
  status: null | 'started' | 'complete' | 'failed'
  onProgress?: (percent: string) => void
  onFinish?: (data: ExportData) => void
  onError?: (err: any) => void
}

const tasks: {
  [id: string]: Task
} = {}

export const exportService = {
  init: () => {
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
  start: async (id: string, clip: Clip) => {
    const { url, start, end, extension, isClientUpload, file } = clip

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
    try {
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

      exportService.complete(id, exportData)
    } catch (e: any) {
      exportService.fail(id, e)
    } finally {
      if (isClientUpload && typeof source === 'string') clearTempData(source)
    }
  },
  complete: (id: string, data: ExportData) => {
    const task = tasks[id]
    task.status = 'complete'
    task.data = data
    task.onFinish?.(data)
  },
  update: (id: string, percent: string) => {
    const task = tasks[id]
    task.onProgress?.(percent)
  },
  fail: (id: string, err: Error) => {
    const task = tasks[id]
    task.status = 'failed'
    err.constructor.name && console.error(err.constructor.name)
    err.message && console.error(err.message)
    err.cause && console.error(err.cause)
    task.onError?.(err)
  },
}
