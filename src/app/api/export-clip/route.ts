import { downloadClip } from '@/lib/download'
import { rewriteFileMetadata } from '@/lib/ffmpeg'

import { createFFmpeg } from '@ffmpeg/ffmpeg'

export const dynamic = 'force-dynamic' // defaults to auto

export const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://localhost:3000/ffmpeg_core_dist/esm/ffmpeg-core.js',
})

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)
  const { sourceVideo, start, end } = data

  const downloadData = await downloadClip(data)
  if (!downloadData) return
  const { writeStream, filePath, fileName } = downloadData

  writeStream.on('finish', () => {
    console.log('Download complete!')
    rewriteFileMetadata(filePath)
  })

  writeStream.on('close', () => {
    console.log('Write stream closed.')
  })

  return Response.json({ fileName, filePath })

  // videoStream.on('progress', (chunkLength, downloaded, total) => {
  //   const percent = (downloaded / total) * 100
  //   console.log(`Downloaded: ${percent.toFixed(2)}%`)
  // })

  // videoStream.on('retry', (i, err) => {
  //   console.error('Error:', err)
  // })

  // // Check if the file already exists
  // fs.access(filePath, fs.constants.F_OK, (err) => {
  //   // file doesn't exist
  //   if (err) {
  //     ytdl(sourceVideo.url, {
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
}
