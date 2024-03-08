import fs from 'fs'
import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export async function downloadClip({ videoUrl, start, end }: Clip) {
  const FILE_NAME_LENGTH = 8
  const fileName = `${nanoid(FILE_NAME_LENGTH)}.mp4`
  const targetPath = `public/${fileName}`

  const writeStream = fs.createWriteStream(targetPath)

  const info = await ytdl.getInfo(videoUrl)
  if (!info) {
    throw new Error('Error fetching video info')
  }

  const formats = info.formats
  const format = ytdl.chooseFormat(info.formats, {
    quality: 'lowest',
    filter: (format) => format.container === 'mp4',
  })

  // Calculate byte offsets based on bitrate
  const bitrate = format.bitrate as number
  const startOffset = Math.floor((start * bitrate) / 8)
  const endOffset = Math.floor((end * bitrate) / 8)

  const videoStream = ytdl(videoUrl, {
    format,
    range: {
      start: startOffset,
      end: endOffset,
    },
  }).pipe(writeStream)

  return { writeStream, filePath: targetPath, fileName }
}
