'use client'

import { Actions } from '@/components/actions'
import { EditorProvider } from '@/components/context/editor'
import { Drawer } from '@/components/drawer'
import { LoadingDialog } from '@/components/lodaing-dialog'
import { VideoEditor } from '@/components/video-editor'
import { Window } from '@/components/window'

export default function Edit() {
  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <EditorProvider>
        <LoadingDialog />
        <Drawer />
        <div className="flex h-full flex-1 items-center justify-center px-6 lg:px-0">
          <div className="flex w-full flex-col items-stretch justify-center gap-6">
            <Window title={'video.mp4'}>
              <VideoEditor />
            </Window>
            <Actions />
          </div>
        </div>
      </EditorProvider>
    </main>
  )
}
