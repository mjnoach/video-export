import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

ffmpeg.setFfmpegPath('/Users/andrzej/ffmpeg/bin/ffmpeg')
ffmpeg.setFfprobePath('/Users/andrzej/ffmpeg/bin/ffprobe')

export async function rewriteFileMetadata(filePath: string) {
  console.log('🚀 ~ rewriteFileMetadata ~ filePath:', filePath)

  try {
    const tempFile = `${filePath}.temp.mp4`
    ffmpeg()
      .input(filePath)
      .output(tempFile)
      .on('end', () => {
        console.log('Conversion finished')
        fs.unlinkSync(filePath)
        fs.rename(tempFile, tempFile.replace('.temp.mp4', ''), (err) => {
          console.error(err)
        })
      })
      .on('error', (err) => {
        console.error(err)
      })
      .run()

    // ffmpeg(new BufferStream(buffer))
    //   .format('gif')
    //   .size('640x360')
    //   .duration('0:15')
    //   .inputFPS(8)
    //   .writeToStream(outStream, { end: true })
  } catch (error) {
    console.error(error)
    // res.status(500).json({ error: 'Internal Server Error' })
  }
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
