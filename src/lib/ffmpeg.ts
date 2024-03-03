import { useEffect, useState } from 'react'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export const ffmpeg = createFFmpeg({ log: true })

export async function useFFmpeg() {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)

  function loadFFmpeg() {
    if (!ffmpeg.isLoaded()) {
      ffmpeg
        .load()
        .then(() => {
          setFFmpegLoaded(true)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  useEffect(() => {
    loadFFmpeg()
  }, [])

  return { ffmpegLoaded }
}

const CONTENT_TYPE = {
  mp4: 'vide/mp4',
  gif: 'image/gif',
}

async function cutVideo(
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
