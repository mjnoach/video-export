'use client'

import { useContext, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Drawer } from '@/components/drawer'
import { VideoPlayer } from '@/components/video-player'

import { EditorContext } from '@/context/editor'

export default function Edit() {
  const { clip } = useContext(EditorContext)
  const router = useRouter()

  useEffect(() => {
    !clip.url && router.replace('/')
  }, [clip, router])

  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <Drawer />
      <div className="flex h-full flex-1 items-center justify-center px-6 lg:px-0">
        <div className="flex w-full max-w-4xl flex-col items-stretch justify-center gap-6">
          <VideoPlayer />
        </div>
      </div>
    </main>
  )
}
