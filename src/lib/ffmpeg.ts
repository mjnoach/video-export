import ffmpeg from 'fluent-ffmpeg'
import { Readable, Writable } from 'stream'

ffmpeg.setFfmpegPath('/Users/andrzej/ffmpeg/bin/ffmpeg')
ffmpeg.setFfprobePath('/Users/andrzej/ffmpeg/bin/ffprobe')

export async function transcodeVideoStream(
  source: string | Readable,
  target: string | Writable,
  start: number,
  end: number
) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(source)
      // .setStartTime(Number(start))
      // .setDuration(Number(end - start))
      .output(target)
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

// ffmpeg(new BufferStream(buffer))
//   .format('gif')
//   .size('640x360')
//   .duration('0:15')
//   .inputFPS(8)
//   .writeToStream(outStream, { end: true })

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
