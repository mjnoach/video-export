'use client'

import { Drawer } from '@/components/drawer'
import { VideoLinkForm } from '@/components/video-link-form'
import { VideoUpload } from '@/components/video-upload'

// TODO
// Feature: Option to choose export quality?
// Feature: Option to add auto-generated captions?
// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range
// Feature: Add watermarks

// Improve: Client souces: Only upload relevant part of the video to the server
// Improve: Remote souces: Only download relevant part of the video on the server

// Improve: Client souces: Process local uploads on the client with wasm ffmpeg
// Improve: Remote souces: Download video on the server and stream it back to the client for local processing with wasm ffmpeg

export default function Home() {
  return (
    <main className="mt-12 w-full">
      <Drawer />
      <div className="min-w-sm grid w-full max-w-lg gap-8">
        <h1 className={`mb-6 text-center text-5xl font-semibold`}>
          Paste & Go
        </h1>
        <VideoLinkForm />
        <VideoUpload />
      </div>
    </main>
  )
}
