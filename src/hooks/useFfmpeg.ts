import { useEffect, useRef, useState } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'

const baseUrl = '/ffmpeg/esm'

export const useFfmpeg = () => {
  const ffmpegRef = useRef(new FFmpeg())
  const [isLoaded, setLoaded] = useState(ffmpegRef.current.loaded)

  useEffect(() => {
    if (!ffmpegRef.current.loaded) {
      loadFfmpeg().then(() => setLoaded(true))
    }
  }, [])

  const loadFfmpeg = async () => {
    console.log('Loading...')
    await ffmpegRef.current.load({
      coreURL: `${baseUrl}/ffmpeg-core.js`,
      wasmURL: `${baseUrl}/ffmpeg-core.wasm`,
      workerURL: `${baseUrl}/ffmpeg-core.worker.js`,
    })
    console.log('FFmpeg loaded!')
  }

  return { ffmpeg: ffmpegRef.current, ffmpegLoaded: isLoaded }
}
