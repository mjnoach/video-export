import { transcodeVideoStream } from './ffmpeg'

import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export async function downloadClip(
  { sourceVideo, start, end, extension }: Clip,
  callbacks?: {
    onFinish: () => void
  }
): Promise<ExportedObj> {
  const FILE_NAME_LENGTH = 8
  const objId = nanoid(FILE_NAME_LENGTH)
  const fileName = `${objId}${extension}`
  const targetPath = `public/${fileName}`

  const info = await ytdl.getInfo(sourceVideo.url)
  const formats = info.formats
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
    path: targetPath,
    start,
    end,
    format: extension.replace(/^./, ''),
  })

  return { id: objId, path: targetPath, url: fileName }
}
