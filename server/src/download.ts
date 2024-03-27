import { DownloadException } from './exceptions.js'
import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { taskManager } from './task-manager.js'

import ytdl from 'ytdl-core'

const { EXPORT_DIR } = process.env

export async function downloadClip(
  id: string,
  { url, start, end, extension }: Clip
): Promise<void> {
  taskManager.startTask(id)

  const fileName = `${id}${extension}`
  const filePath = `${EXPORT_DIR}/${fileName}`
  const fileFormat = extension.replace(/^./, '')
  const duration = end - start

  const targetClip: ExportTarget = {
    path: filePath,
    format: fileFormat,
    duration,
  }

  const stream = await getSourceStream(url)
  await transcodeVideo(id, stream, { ...targetClip, start })

  const withThumbnails = false
  const thumbnail =
    withThumbnails && fileFormat === 'mp4'
      ? await generateThumbnail(filePath, id)
      : null

  const exportedObj = {
    id,
    ...targetClip,
    url: `${EXPORT_DIR}/${fileName}`,
    thumbnail,
  }

  taskManager.completeTask(id, exportedObj)
  return
}

async function getSourceStream(url: string) {
  // blob: //localhost:3000/f1e08c0b-b067-4e6e-a67a-ac3c9e4f34f8
  console.log('🚀 ~ getSourceStream ~ url:', url)

  try {
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'lowest',
      filter: (format) => format.container === 'mp4',
    })
    const stream = ytdl(url, {
      format,
    })
    return stream
  } catch (e) {
    throw DownloadException(e, url)
  }
}
