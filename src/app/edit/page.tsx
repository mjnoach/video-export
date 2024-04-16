'use client'

import { Drawer } from '@/components/drawer'
import { NoSSR } from '@/components/no-ssr'
import { VideoPlayer } from '@/components/video-player'

import { useWakeUpServer } from '@/lib/api'

export default function Edit() {
  useWakeUpServer()

  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <Drawer />
      <div className="center flex w-full max-w-4xl flex-col items-stretch justify-center gap-6">
        <NoSSR>
          <VideoPlayer />
        </NoSSR>
      </div>
    </main>
  )
}
