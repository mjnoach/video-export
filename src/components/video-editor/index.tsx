'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { VideoPlayer } from './video-player'
import { VideoUpload } from './video-upload'

import loading from '@/../public/loading.gif'
import { createFFmpeg } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

type VideoEditorProps = {
  video?: any
}

export function VideoEditor(props: VideoEditorProps) {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
  const [video, setVideo] = useState<Video | null>(props.video ?? null)
  const [processing, setProcessing] = useState(false)

  const isLoading = !ffmpegLoaded || processing

  function resetState() {
    setVideo(null)
  }

  useEffect(() => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load().then(() => {
        setFFmpegLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    console.log('🚀 ~ VideoEditor ~ video:', video)
    if (!video) resetState()
  }, [video])

  return (
    <div className="flex h-full flex-col">
      <div className="flex grow flex-col justify-between">
        <div className="flex aspect-video grow flex-col items-center justify-center bg-gray-950">
          {/* <LoadingCard /> */}
          {isLoading ? (
            <Image src={loading} alt="loading" className="h-16 w-16" />
          ) : !video ? (
            <VideoUpload
              disabled={!!video}
              setVideo={(video: Video) => {
                setVideo(video)
              }}
            />
          ) : (
            <VideoPlayer video={video} />
          )}
        </div>
      </div>
    </div>
  )
}

const LoadingCard = () => (
  <div className="flex h-full flex-col">
    <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4 shadow">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-slate-700"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-slate-700"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-slate-700"></div>
              <div className="col-span-1 h-2 rounded bg-slate-700"></div>
            </div>
            <div className="h-2 rounded bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
