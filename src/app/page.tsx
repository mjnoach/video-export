'use client'

import { Drawer } from '@/components/drawer'
import { VideoLinkForm } from '@/components/video-link-form'
import { VideoUpload } from '@/components/video-upload'

// TODO
// Feature: Option to choose export quality?
// Feature: Option to generate captions?
// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range
// Feature: Add watermarks
// Feature: Add Security remarks to the homepage:
//          Your users' data only lives inside their browser, no need to worry about any data leakage or network latency.

// TO DO: Disable the Drawer component due to exported data not being persistent on the client nor the server
// TO DO: Exclude server files & disable Render deployments

// Improve: Review upload and export file formats

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
