import fs from 'fs'
import ytdl from 'ytdl-core'

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
  return Response.json({ message: 'GET Hello World' })
}

export async function POST(request: Request) {
  const data = await request.json()

  // * FETCH DIRECTLY

  // const res = await fetch(data.videoUrl, {
  //   headers: {
  //     'Content-Type': 'video/mp4',
  //     'Content-Disposition': `attachment; filename="video.mp4"`,
  //   },
  // })

  // const video = await res.blob()
  // console.log('🚀 ~ POST ~ video:', video)

  // * USE YOUTUBE-DL

  const fileName = `${data.videoName}.mp4` ?? 'video.mp4'
  const filePath = `public/${fileName}`
  // Check if the file already exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // file doesn't exist
    if (err) {
      const stream = ytdl(data.videoUrl).pipe(fs.createWriteStream(filePath))
    }
    // file already exists
    else {
      // console.error(
      //   `File ${filePath} already exists. Choose a different filename or perform the desired action.`
      // )
    }
  })

  return Response.json({ fileName })

  // return Response.json({ message: 'POST Hello World' })

  // "Content-Range": "bytes " + start + "-" + end + "/" + total,
  // "Accept-Ranges": "bytes",
  // "Content-Length": chunksize,
  // "Content-Type": "video/mp4"

  // return new Response(video, {
  //   headers: {
  //     'Content-Range': 'bytes 0-100/100',
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': video.size.toString(),
  //     'Content-Type': 'video/mp4',
  //   },
  // })
}
