'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Drawer } from '@/components/drawer'
import { VideoLinkForm } from '@/components/video-link-form'
import { VideoUpload } from '@/components/video-upload'

// TODO
// Feature: Choose video formats/sizes
// Feature: Option to attach auto-generated captions?
// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range

// Improve: Process local uploads on the client with wasm ffmpeg?
// Improve: Clip local uploads on the client, not to stream irrelevant data to the server

export default function Home() {
  const [isLoaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    isLoaded && router.push(`/edit`)
  }, [isLoaded, router])

  return (
    <main className="mt-12">
      <Drawer />
      <div className="grid gap-8">
        <h1 className={`mb-6 text-center text-5xl font-semibold`}>
          Paste & Go
        </h1>
        <VideoLinkForm setLoaded={setLoaded} />
        <VideoUpload setLoaded={setLoaded} />
      </div>
    </main>
  )
}
