import { generateThumbnail, transcodeVideo } from './ffmpeg.js'
import { taskManager } from './task-manager.js'

import ytdl from 'ytdl-core'

const { EXPORT_DIR } = process.env

export async function downloadClip(
  id: string,
  { sourceVideo, start, end, extension }: Clip
): Promise<void> {
  taskManager.startTask(id)

  const fileName = `${id}${extension}`
  const filePath = `${EXPORT_DIR}/${fileName}`
  const fileFormat = extension.replace(/^./, '')
  const duration = end - start

  const targetClip: TargetClip = {
    path: filePath,
    format: fileFormat,
    duration,
  }

  const stream = await getSourceStream(sourceVideo)
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

async function getSourceStream(sourceVideo: SourceVideo) {
  try {
    const info = await ytdl.getInfo(sourceVideo.url)
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'lowest',
      filter: (format) => format.container === 'mp4',
    })
    const stream = ytdl(sourceVideo.url, {
      format,
    })
    return stream
  } catch (e) {
    console.error(`Error downloading video stream`, e)
    throw e
  }
}
