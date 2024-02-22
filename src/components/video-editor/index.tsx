'use client'

import { useEffect, useState } from 'react'

import { Loading } from '../loading'
import { VideoPlayer } from '../video-player'
import { VideoUpload } from './video-upload'

type VideoEditorProps = {
  video?: any
}

export function VideoEditor(props: VideoEditorProps) {
  const [video, setVideo] = useState<Video | null>(props.video ?? null)
  // const { ffmpegLoaded } = useFFmpeg()

  // const isLoading = !ffmpegLoaded
  const isLoading = false

  function resetState() {
    setVideo(null)
  }

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
            <VideoPlayer video={video} />
          )}
        </div>
      </div>
    </div>
  )
}
