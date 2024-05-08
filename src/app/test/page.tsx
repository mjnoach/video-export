'use client'

import { useRef } from 'react'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Log, Progress } from '@ffmpeg/types'
import { fetchFile } from '@ffmpeg/util'

export default function Test() {
  const ffmpegRef = useRef<any>(null)
  const videoRef = useRef<any>(null)

  // console.log('🚀 ~ window.crossOriginIsolated:', window.crossOriginIsolated)

  const load = async () => {
    console.log('Loading...')

    await ffmpegRef.current.load({
      coreURL: `/ffmpeg/esm/ffmpeg-core.js`,
      wasmURL: `/ffmpeg/esm/ffmpeg-core.wasm`,
      workerURL: `/ffmpeg/esm/ffmpeg-core.worker.js`,
      //
      // coreURL: await toBlobURL(
      //   'http://127.0.0.1:3000/ffmpeg/esm/ffmpeg-core.js',
      //   'text/javascript'
      // ),
      // wasmURL: await toBlobURL(
      //   'http://127.0.0.1:3000/ffmpeg/esm/ffmpeg-core.wasm',
      //   'application/wasm'
      // ),
      // workerURL: await toBlobURL(
      //   'http://127.0.0.1:3000/ffmpeg/esm/ffmpeg-core.worker.js',
      //   'text/javascript'
      // ),
    })

    console.log('FFmpeg loaded!')

    ffmpegRef.current.on('progress', ({ progress, time }: Progress) => {
      console.log('🚀 ~ progress, time:', progress, time)
    })
    ffmpegRef.current.on('log', ({ type, message }: Log) => {
      console.log(message)
    })
  }

  const transcode = async () => {
    await ffmpegRef.current.writeFile(
      'input.webm',
      await fetchFile(
        'http://localhost:3001/static/g4OGhcc3.mp4'
        // 'https://www.youtube.com/watch?v=221F55VPp2M'
        // 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'
      )
    )
    await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4'])
    const data = await ffmpegRef.current.readFile('output.mp4')
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    )
  }

  return (
    <main className="/flex-row flex h-full w-full items-start px-8 lg:px-16">
      <button
        onClick={async () => {
          if (!!ffmpegRef.current) return
          const ffmpeg = new FFmpeg()
          ffmpegRef.current = ffmpeg
          await load()
        }}
      >
        LOAD
      </button>
      <br />
      <button
        onClick={async () => {
          if (!ffmpegRef.current.loaded) return
          await transcode()
        }}
      >
        TEST
      </button>
      <br />
      <video ref={videoRef} controls></video>
    </main>
  )
}
