import { transcodeVideoStream } from './ffmpeg'

import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export async function downloadClip(
  { sourceVideo, start, end, extension }: Clip,
  callbacks?: {
    onFinish: () => void
  }
): Promise<ExportedObj> {
  const OBJ_ID_LENGTH = 8
  const objId = nanoid(OBJ_ID_LENGTH)
  const fileName = `${objId}${extension}`
  const filePath = `public/${fileName}`
  const fileFormat = extension.replace(/^./, '')

  const info = await ytdl.getInfo(sourceVideo.url)
  const format = ytdl.chooseFormat(info.formats, {
    quality: 'lowest',
    filter: (format) => format.container === 'mp4',
  })

  const readStream = ytdl(sourceVideo.url, {
    format,
  })

  const readError = readStream.errored
  if (readError)
    throw new Error(
      `Error downloading video stream. ${readError.name} ${readError.message}`
    )

  await transcodeVideoStream(readStream, {
    path: filePath,
    start,
    end,
    format: fileFormat,
  })

  // if (fileFormat === 'mp4') await generateThumbnail(filePath, objId)

  return { id: objId, path: filePath, url: fileName }
}
