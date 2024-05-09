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

// Fix: For remote sources, dowsnload the video on the server and stream it to the client for local processing.

// Improve: Review upload and export file formats

// Improve: For client sources (video uploads), use wasm ffmpeg and do local processing on the client
//          Security: your users' data only lives inside their browser, no need to worry about any data leakage or network latency.

// Improve: Client souces: Only upload relevant part of the video to the server
//          That'd require using ffmpeg on the client, so at that point it'd be better
//          to do entire processing work on the client anyways
// Improve: Remote souces: Only download relevant part of the video on the server
//          That'd require calculating clip start and duration values from bitrate data.
//          That might be difficult to do precisely.

// Improve: Client souces: Process local uploads on the client with wasm ffmpeg
// Improve: Remote souces: Download video on the server and stream it back to the client for local processing with wasm ffmpeg

// Optimise: cpu, memory, bandwidth, disk

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
