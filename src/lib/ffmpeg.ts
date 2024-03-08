import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export const ffmpeg = createFFmpeg({ log: true })

export async function rewriteFileMetadata(filePath: string) {
  console.log('🚀 ~ rewriteFileMetadata ~ filePath:', filePath)
  if (!ffmpeg.isLoaded()) await ffmpeg.load()
  // Use ffmpeg to correct video duration metadata
  await ffmpeg.run(
    '-i',
    filePath,
    '-c',
    'copy',
    '-fflags',
    '+genpts',
    `${filePath}_temp`,
    '&&',
    'mv',
    `${filePath}_temp`,
    filePath
  )

  // await ffmpeg.run(
  //   '-i',
  //   filePath,
  //   '-vcodec',
  //   'copy',
  //   '-acodec',
  //   'copy',
  //   `${filePath}_fixed.mp4`
  // )
}

// export async function useFFmpeg() {
//   const [ffmpegLoaded, setFFmpegLoaded] = useState(false)

//   function loadFFmpeg() {
//     if (!ffmpeg.isLoaded()) {
//       ffmpeg
//         .load()
//         .then(() => {
//           setFFmpegLoaded(true)
//         })
//         .catch((err) => {
//           console.error(err)
//         })
//     }
//   }

//   useEffect(() => {
//     loadFFmpeg()
//   }, [])

//   return { ffmpegLoaded }
// }

const CONTENT_TYPE = {
  mp4: 'vide/mp4',
  gif: 'image/gif',
}

export async function cutVideo(
  obj: string | Buffer | Blob | File,
  start: number,
  end: number,
  ext: keyof typeof CONTENT_TYPE
) {
  const inputFileName = 'input.mp4'
  const outputFileName = `output.${ext}`

  ffmpeg.FS('writeFile', inputFileName, await fetchFile(obj))
  await ffmpeg.run(
    '-i',
    inputFileName,
    '-ss',
    start.toString(),
    '-to',
    end.toString(),
    '-f',
    ext,
    outputFileName
  )

  const data = ffmpeg.FS('readFile', outputFileName)
  const dataUrl = URL.createObjectURL(
    new Blob([data.buffer], { type: CONTENT_TYPE[ext] })
  )

  return dataUrl
}
