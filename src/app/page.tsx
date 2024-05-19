'use client'

import { VideoUpload } from '@/components/video-upload'

import { EXPORT_FORMATS } from '@/lib/utils'

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
      {/* <Drawer /> */}
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
        {/* <VideoLinkForm /> */}
        <VideoUpload />
      </div>
    </main>
  )
}
