'use client'

import { VideoUpload } from '@/components/video-upload'

import { EXPORT_FORMATS } from '@/lib/utils'

// TODO

// - [ ] Feature – Option to choose export quality?
// - [ ] Feature – Option to generate captions?
// - [ ] Feature – Multiple slider ranges for exporting a video combined of multiple clips
// - [ ] Feature – Add a cropping frame that will only capture the selected area for a given slider range
// - [ ] Feature – Add watermarks
// – [ ] Feature – Show download progress on the client
// - [ ] Feature – Add feature flag for server exports on local environment
// - [ ] Feature – Add Security remarks to the homepage
//                 Your users' data only lives inside their browser, no need to worry about any data leakage or network latency.

// - [ ] Fix – Abort export when user leaves the editor
// - [ ] Fix – Reloading remote source page?

// - [ ] Improve – Review upload and export file formats
// - [ ] Improve – Cache ffmpeg to prevent reloading on page refresh
// - [ ] Improve – Secure api/download action to prevent it from being accessed outside the app
// - [//!] Improve – Add a config env that will control to use either client or server export and display ui accordingly

// – Optimise: cpu, memory, bandwidth, disk
// – Rate limiting?
// – If source is remote, after download, write it to FFmpeg FS and on subsequent loads check if there's a resouce already for that url

export default function Home() {
  return (
    <main
      className="mt-12 w-full"
      onDrop={(e) => {
        e.preventDefault()
      }}
      onDragOver={(e) => {
        e.preventDefault()
      }}
    >
      <div className="min-w-sm grid w-full max-w-lg gap-16">
        <div className="text-center text-lg">
          <h1 className={`mb-8 text-5xl font-semibold`}>
            Trim & Export Videos
          </h1>
          <p className="mb-2 text-primary-2">Supported output formats</p>
          <p className="text-primary-3">
            {EXPORT_FORMATS.join(', ').toUpperCase()}
          </p>
        </div>
        <VideoUpload />
      </div>
    </main>
  )
}
