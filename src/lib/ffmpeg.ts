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

export async function cutVideo(
  obj: string | Buffer | Blob | File,
  start: number,
  end: number
) {
  const inputFileName = 'input.mp4'
  const outputFileName = 'output.mp4'

  ffmpeg.FS('writeFile', inputFileName, await fetchFile(obj))
  await ffmpeg.run(
    '-i',
    inputFileName,
    '-ss',
    `${start}`,
    '-to',
    `${end}`,
    '-f',
    'mp4',
    outputFileName
  )

  const data = ffmpeg.FS('readFile', outputFileName)
  const dataUrl = URL.createObjectURL(
    new Blob([data.buffer], { type: 'video/mp4' })
  )

  return dataUrl
}
