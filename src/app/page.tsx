'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Drawer } from '@/components/drawer'
import { VideoLinkForm } from '@/components/video-link-form'
import { VideoUpload } from '@/components/video-upload'

// TODO
// Feature: Name input at the top of the window
// Feature: Choose video formats/sizes
// Feature: Option to attach auto-generated captions?
// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range
// Improve: Use SSE instead of raw stream?
// Improve: Unset video buffering screen after player seek or clip export
// Improve: Configure monorepo with turborepo
// Improve: Configure secure server with https or/and http2?
// Improve: Enpodints input validataion
// Improve: Add processing exports to drawer
// Fix: Local file upload
//  if file is local, process in browser ffmpeg rather than on the server?
//  or at least send over only selected part, not entire video
// Fix: Unset processing/loading behind the error overlay

export default function Home() {
  const [isLoaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    isLoaded && router.push(`/edit`)
  }, [isLoaded, router])

  return (
    <main>
      <Drawer />
      <div className="mt-20 grid gap-8">
        <VideoLinkForm setLoaded={setLoaded} />
        <div className="flex aspect-video grow flex-col items-center justify-center">
          <VideoUpload setLoaded={setLoaded} />
        </div>
      </div>
    </main>
  )
}
