import fs from 'fs'
import { nanoid } from 'nanoid'
import ytdl from 'ytdl-core'

export const dynamic = 'force-dynamic' // defaults to auto

const FILE_NAME_LENGTH = 8

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  const { videoUrl, start, end } = data

  const fileName = `${nanoid(FILE_NAME_LENGTH)}.mp4`
  const filePath = `public/${fileName}`

  const info = await ytdl.getInfo(videoUrl)
  if (!info) {
    console.error('Error fetching video info:', videoUrl)
    return
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

  const writeStream = fs.createWriteStream(filePath)

  const videoStream = ytdl(videoUrl, {
    format,
    range: {
      start: startOffset,
      end: endOffset,
    },
  }).pipe(writeStream)

  videoStream.on('progress', (chunkLength, downloaded, total) => {
    const percent = (downloaded / total) * 100
    console.log(`Downloaded: ${percent.toFixed(2)}%`)
  })

  videoStream.on('retry', (i, err) => {
    console.error('Error:', err)
  })

  writeStream.on('finish', () => {
    console.log('Download complete!')
  })

  writeStream.on('close', () => {
    console.log('Write stream closed.')
  })

  // // Check if the file already exists
  // fs.access(filePath, fs.constants.F_OK, (err) => {
  //   // file doesn't exist
  //   if (err) {
  //     ytdl(videoUrl, {
  //       // range: {
  //       //   start: start,
  //       //   end: end,
  //       // },
  //     }).pipe(fs.createWriteStream(filePath))
  //   }
  //   // file already exists
  //   else {
  //     console.error(
  //       `File ${filePath} already exists. Choose a different filename or perform the desired action.`
  //     )
  //   }
  // })

  return Response.json({ fileName })
}
