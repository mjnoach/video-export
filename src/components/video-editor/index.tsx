'use client'

import { useEffect, useState } from 'react'

import { VideoPlayer } from '../video-player'
import { VideoUpload } from './video-upload'

type VideoEditorProps = {
  video?: SourceVideo
}

export function VideoEditor(props: VideoEditorProps) {
  const [video, setVideo] = useState<SourceVideo | null>(props.video ?? null)

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
          {!video ? (
            <VideoUpload
              disabled={!!video}
              setVideo={(video: SourceVideo) => {
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
