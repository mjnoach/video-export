'use client'

import { useContext, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Actions } from '@/components/actions'
import { EditorContext } from '@/components/context/editor'
import { Drawer } from '@/components/drawer'
import { VideoPlayer } from '@/components/video-player'
import { Window } from '@/components/window'

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
        <div className="flex w-full flex-col items-stretch justify-center gap-6">
          <Window title={'video.mp4'}>
            <div className="flex aspect-video grow flex-col items-center justify-center">
              <VideoPlayer />
            </div>
          </Window>
          <Actions />
        </div>
      </div>
    </main>
  )
}
