import { useEffect, useRef, useState } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'

const ffmpeg = new FFmpeg()

const loadFfmpeg = async () => {
  console.log('Loading...')
  await ffmpeg.load({
    coreURL: `/ffmpeg/esm/ffmpeg-core.js`,
    wasmURL: `/ffmpeg/esm/ffmpeg-core.wasm`,
    workerURL: `/ffmpeg/esm/ffmpeg-core.worker.js`,
  })
  console.log('FFmpeg loaded!')
}

// ?? use context instead?

export const useFfmpeg = () => {
  const [isLoaded, setLoaded] = useState(ffmpeg.loaded)
  const ffmpegRef = useRef(ffmpeg)

  useEffect(() => {
    if (!ffmpegRef.current.loaded) {
      loadFfmpeg().then(() => setLoaded(true))
    }
  }, [])

  return { ffmpeg: ffmpegRef.current, ffmpegLoaded: isLoaded }
}
