'use client'

import { VideoUpload } from '@/components/video-upload'

export default function Home() {
  return (
    <main className="mt-12 w-full">
      {/* <Drawer /> */}
      <div className="min-w-sm grid w-full max-w-lg gap-8">
        <h1 className={`mb-6 text-center text-5xl font-semibold`}>
          Paste & Go
        </h1>
        {/* <VideoLinkForm /> */}
        <VideoUpload />
      </div>
    </main>
  )
}
