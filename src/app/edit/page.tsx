'use client'

import { Suspense, useState } from 'react'

import { Actions } from '@/components/actions'
import { EditorProvider } from '@/components/context/editor'
import { Drawer } from '@/components/drawer'
import { VideoPlayer } from '@/components/video-player'
import { VideoUpload } from '@/components/video-upload'
import { Window } from '@/components/window'

export default function Edit() {
  const [isLoaded, setLoaded] = useState(false)

  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <EditorProvider>
        <Drawer />
        <div className="flex h-full flex-1 items-center justify-center px-6 lg:px-0">
          <div className="flex w-full flex-col items-stretch justify-center gap-6">
            <Window title={'video.mp4'}>
              <div className="flex aspect-video grow flex-col items-center justify-center">
                {!isLoaded ? (
                  <Suspense>
                    <VideoUpload setLoaded={setLoaded} />
                  </Suspense>
                ) : (
                  <VideoPlayer />
                )}
              </div>
            </Window>
            <Actions />
          </div>
        </div>
      </EditorProvider>
    </main>
  )
}
