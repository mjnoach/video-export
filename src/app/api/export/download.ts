import { taskManager } from '../task-manager'
import { transcodeVideo } from './ffmpeg'

import ytdl from 'ytdl-core'

export async function downloadClip(
  id: string,
  { sourceVideo, start, end, extension }: Clip
): Promise<void> {
  const fileName = `${id}${extension}`
  const filePath = `public/${fileName}`
  const fileFormat = extension.replace(/^./, '')
  const duration = end - start

  const targetClip: TargetClip = {
    path: filePath,
    format: fileFormat,
    duration,
  }

  const stream = await getSourceStream(sourceVideo)
  await transcodeVideo(id, stream, { ...targetClip, start })

  const thumbnail = null
  // fileFormat === 'mp4' ? await generateThumbnail(filePath, objId) : null

  const exportedObj = {
    id,
    ...targetClip,
    url: fileName,
    thumbnail,
  }

  taskManager.completeTask(id, exportedObj)
  return
}

async function getSourceStream(sourceVideo: SourceVideo) {
  const info = await ytdl.getInfo(sourceVideo.url)
  const format = ytdl.chooseFormat(info.formats, {
    quality: 'lowest',
    filter: (format) => format.container === 'mp4',
  })
  const stream = ytdl(sourceVideo.url, {
    format,
  })
  const error = stream.errored
  if (error)
    throw new Error(
      `Error downloading video stream. ${error.name} ${error.message}`
    )
  return stream
}
