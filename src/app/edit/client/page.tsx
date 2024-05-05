'use client'

import { useContext, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Drawer } from '@/components/drawer'
import { NoSSR } from '@/components/no-ssr'
import { VideoPlayer } from '@/components/video-player'

import { useWakeUpServer } from '@/lib/api'

import { EditorContext } from '@/context/editor'

export default function Edit() {
  useWakeUpServer()

  const router = useRouter()
  const editor = useContext(EditorContext)

  useEffect(() => {
    if (!editor.clip.isClientUpload) router.replace('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

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
