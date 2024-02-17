'use client'

import { useEffect, useState } from 'react'

import { Loading } from '../loading'
import { VideoPlayer } from '../video-player'
import { VideoUpload } from './video-upload'

import { createFFmpeg } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

type VideoEditorProps = {
  video?: any
}

export function VideoEditor(props: VideoEditorProps) {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
  const [video, setVideo] = useState<Video | null>(props.video ?? null)

  const isLoading = !ffmpegLoaded

  function resetState() {
    setVideo(null)
  }

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (!video) resetState()
  }, [video])

  return (
    <div className="flex h-full flex-col">
      <div className="flex grow flex-col justify-between">
        <div className="flex aspect-video grow flex-col items-center justify-center">
          {isLoading ? (
            <Loading />
          ) : !video ? (
            <VideoUpload
              disabled={!!video}
              setVideo={(video: Video) => {
                setVideo(video)
              }}
            />
          ) : (
            <VideoPlayer video={video} ffmpeg={ffmpeg} />
          )}
        </div>
      </div>
    </div>
  )
}
