import fs from 'fs'
import ytdl from 'ytdl-core'

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: Request) {
  const data: Clip = await request.json()
  console.log('🚀 ~ POST ~ data:', data)

  // const fileName = data.videoTitle ? `${data.videoTitle}.mp4` : 'video.mp4'
  const fileName = 'video.mp4'
  const filePath = `public/${fileName}`
  // Check if the file already exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // file doesn't exist
    if (err) {
      ytdl(data.videoUrl, {
        range: {
          start: data.start,
          end: data.end,
        },
      }).pipe(fs.createWriteStream(filePath))
    }
    // file already exists
    else {
      // console.error(
      //   `File ${filePath} already exists. Choose a different filename or perform the desired action.`
      // )
    }
  })

  return Response.json({ filePath: fileName })
}
