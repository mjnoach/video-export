import { transcodeVideoStream } from './ffmpeg'

import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export async function downloadClip(
  { sourceVideo, start, end, extension }: Clip,
  callbacks?: {
    onFinish: () => void
  }
) {
  const FILE_NAME_LENGTH = 8
  const fileName = `${nanoid(FILE_NAME_LENGTH)}${extension}`
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

  // const writeStream = fs.createWriteStream(targetPath)
  // readStream.pipe(writeStream)

  // writeStream.on('finish', () => {
  //   console.log('Download complete!')
  //   callbacks.onFinish()
  // })

  // writeStream.on('close', () => {
  //   console.log('Write stream closed.')
  // })

  return { filePath: targetPath, fileName }
}
