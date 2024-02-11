import { VideoEditor } from '@/components/video-editor'
import { Window } from '@/components/window'

export default function Edit() {
  return (
    <main>
      {/* <SidePanel /> */}
      <div className="noise flex h-full flex-1 items-center justify-center px-6 lg:px-0">
        <div className="flex w-full flex-col items-stretch justify-center gap-6">
          <Window title={'Title'}>
            <VideoEditor />
          </Window>
          <Actions />
        </div>
      </div>
    </main>
  )
}

const Actions = () => (
  <div className="mx-auto flex gap-4 rounded-lg bg-zinc-900 p-4 drop-shadow-xl">
    <button className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-brand bg-brand/50 px-4 py-2 text-xs font-medium text-blue-300 ring-offset-zinc-500 transition-colors hover:bg-brand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      Preview
    </button>
    <button className="inline-flex h-8 w-20 items-center justify-center whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-xs font-medium text-zinc-300 ring-offset-zinc-500 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      Export
    </button>
  </div>
)

const SidePanel = () => (
  <div className="relative z-[50] h-full w-40 border-r border-zinc-700 bg-black"></div>
)
