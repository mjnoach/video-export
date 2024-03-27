import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { handleClientUpload, handleRemoteStream } from './sources.js'
import { clearTempData } from './utils.js'

import { nanoid } from 'nanoid'

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

const initialState: Task = {
  data: null,
  status: null,
}

export const exportManager = {
  init: () => {
    const OBJ_ID_LENGTH = 8
    const id = nanoid(OBJ_ID_LENGTH)
    tasks[id] = initialState
    return { id }
  },
  get: (id: string) => {
    return tasks[id]
  },
  start: async (
    id: string,
    { url, start, end, extension, isClientUpload, file }: Clip
  ) => {
    const task = tasks[id]
    task.status = 'started'

    const fileName = `${id}${extension}`
    const filePath = `${EXPORT_DIR}/${fileName}`
    const fileFormat = extension.replace(/^./, '')
    const duration = end - start

    const targetClip: ExportTarget = {
      id,
      path: filePath,
      format: fileFormat,
      duration,
    }

    try {
      const source = isClientUpload
        ? await handleClientUpload(file, targetClip)
        : await handleRemoteStream(url)

      await transcodeVideo(source, { ...targetClip, start })

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

      if (isClientUpload && typeof source === 'string') clearTempData(source)
      exportManager.complete(id, exportData)
    } catch (e: any) {
      exportManager.fail(id, e)
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
