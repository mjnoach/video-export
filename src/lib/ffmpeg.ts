import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'

ffmpeg.setFfmpegPath('/Users/andrzej/ffmpeg/bin/ffmpeg')
ffmpeg.setFfprobePath('/Users/andrzej/ffmpeg/bin/ffprobe')

export async function transcodeVideoStream(
  source: string | Readable,
  target: {
    path: string
    start: number
    end: number
    format: string
  }
) {
  const { path, start, end, format } = target
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(source)
      .setDuration(end - start)
      .output(path)
      .seekOutput(start)
      .format(format)
      .on('start', () => {
        console.log('Transcoding started!')
      })
      .on('end', () => {
        console.log('Transcoding complete!', target)
        resolve(true)
      })
      .on('error', (err) => {
        console.error(err)
        reject(err)
      })
      .run()
  })
}

const CONTENT_TYPE = {
  mp4: 'vide/mp4',
  gif: 'image/gif',
}

// export async function cutVideo(
//   obj: string | Buffer | Blob | File,
//   start: number,
//   end: number,
//   ext: keyof typeof CONTENT_TYPE
// ) {
//   const inputFileName = 'input.mp4'
//   const outputFileName = `output.${ext}`

//   ffmpeg.FS('writeFile', inputFileName, await fetchFile(obj))
//   await ffmpeg.run(
//     '-i',
//     inputFileName,
//     '-ss',
//     start.toString(),
//     '-to',
//     end.toString(),
//     '-f',
//     ext,
//     outputFileName
//   )

//   const data = ffmpeg.FS('readFile', outputFileName)
//   const dataUrl = URL.createObjectURL(
//     new Blob([data.buffer], { type: CONTENT_TYPE[ext] })
//   )

//   return dataUrl
// }
