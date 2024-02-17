'use client'

import { useContext } from 'react'

import { EditorContext, EditorProvider } from '@/components/context/editor'
import { Drawer } from '@/components/drawer'
import { Button } from '@/components/ui/button'
import { VideoEditor } from '@/components/video-editor'
import { Window } from '@/components/window'

export default function Edit() {
  return (
    <main className="flex h-full w-full flex-row items-start px-8 lg:px-16">
      <EditorProvider>
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

const Actions = () => {
  const { actions, disabled } = useContext(EditorContext)

  async function handleExport() {
    actions.exportVideo?.().catch((e: any) => {
      console.error(e)
    })
  }

  return (
    <div className="mx-auto flex gap-4 rounded-lg bg-zinc-900 p-4 drop-shadow-xl">
      <Button
        disabled={!actions.previewVideo || disabled}
        onClick={() => actions.previewVideo?.()}
        className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-brand bg-brand/50 px-4 py-2 font-medium text-zinc-300 ring-offset-zinc-500 transition-colors hover:bg-brand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Preview
      </Button>
      <Button
        disabled={!actions.exportVideo || disabled}
        onClick={handleExport}
        className="inline-flex h-8 w-20 items-center justify-center whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 font-medium text-zinc-300 ring-offset-zinc-500 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Export
      </Button>
    </div>
  )
}
