'use client'

import { useContext } from 'react'

import { useRouter } from 'next/navigation'

import { NoSSR } from '@/components/no-ssr'
import { VideoPlayer } from '@/components/video-player'

import { cn } from '@/lib/utils'

import { EditorContext } from '@/context/editor'

export default function Edit() {
  const router = useRouter()
  const editor = useContext(EditorContext)

  return (
    <main
      className={cn(
        'flex h-full w-full flex-row items-start px-8 lg:px-16',
        editor.data.length ? 'pl-[3.5rem]' : ''
      )}
    >
      {/* <Drawer /> */}
      <div className="center flex w-full max-w-4xl flex-col items-stretch justify-center gap-6">
        <NoSSR>
          <VideoPlayer />
        </NoSSR>
      </div>
    </main>
  )
}
