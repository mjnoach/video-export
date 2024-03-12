import { transcodeVideoStream } from './ffmpeg'

import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export async function downloadClip(
  { sourceVideo, start, end }: Clip,
  callbacks?: {
    onFinish: () => void
  }
) {
  const FILE_NAME_LENGTH = 8
  const fileName = `${nanoid(FILE_NAME_LENGTH)}.mp4`
  const filePath = `public/${fileName}`

  const info = await ytdl.getInfo(sourceVideo.url)
  const formats = info.formats
  const format = ytdl.chooseFormat(info.formats, {
    quality: 'lowest',
    filter: (format) => format.container === 'mp4',
  })

  // Calculate byte offsets based on bitrate
  const bitrate = format.bitrate as number
  const startOffset = Math.round((start * bitrate) / 8)
  const endOffset = Math.round((end * bitrate) / 8)

  const readStream = ytdl(sourceVideo.url, {
    format,
    range: {
      start: startOffset,
      end: endOffset,
    },
  })

  await transcodeVideoStream(readStream, filePath, start, end)

  // const writeStream = fs.createWriteStream(filePath)
  // readStream.pipe(writeStream)

  // writeStream.on('finish', () => {
  //   console.log('Download complete!')
  //   callbacks.onFinish()
  // })

  // writeStream.on('close', () => {
  //   console.log('Write stream closed.')
  // })

  return { filePath, fileName }
}
