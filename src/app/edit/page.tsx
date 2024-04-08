'use client'

import { Drawer } from '@/components/drawer'
import { NoSSR } from '@/components/no-ssr'
import { VideoPlayer } from '@/components/video-player'

export default function Edit() {
  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <Drawer />
      <div className="flex h-full flex-1 items-center justify-center px-6 lg:px-0">
        <div className="flex w-full max-w-4xl flex-col items-stretch justify-center gap-6">
          <NoSSR>
            <VideoPlayer />
          </NoSSR>
        </div>
      </div>
    </main>
  )
}
