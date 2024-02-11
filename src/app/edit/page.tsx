'use client'

import { useSearchParams } from 'next/navigation'

export default function Edit() {
  const searchParams = useSearchParams()
  const videoUrl = searchParams.get('videoUrl')

  return (
    <main>
      {/* <SidePanel /> */}
      <div className="noise flex h-full flex-1 items-center justify-center px-6 lg:px-0">
        <div className="flex w-full flex-col items-stretch justify-center gap-6">
          <Window title={'Title'} />
          <Actions />
        </div>
      </div>
    </main>
  )
}

const SidePanel = () => (
  <div className="relative z-[50] h-full w-40 border-r border-zinc-700 bg-black"></div>
)

type WindowProps = React.HtmlHTMLAttributes<HTMLElement> & {
  title: string
}

const Window = (props: WindowProps) => (
  <div className="relative isolate">
    <div className="relative mx-auto w-[48rem] rounded-lg border border-zinc-800 bg-black/80 shadow-2xl">
      <div className="relative flex items-center justify-center px-2 py-4">
        <div className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-400 ring-gray-800">
          <div className="relative">
            <DotIcon />
            <span className="bg-transparent pl-2 text-center focus:border-none focus:outline-none">
              {props.title}
            </span>
          </div>
        </div>
        <WindowControls />
      </div>
      <div className="relative aspect-video p-4">Content</div>
    </div>
  </div>
)

const DotIcon = () => (
  <svg
    className="absolute left-[-10px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 fill-blue-500"
    viewBox="0 0 6 6"
    aria-hidden="true"
  >
    <circle cx="3" cy="3" r="3"></circle>
  </svg>
)

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

const WindowControls = () => (
  // <div className="flex gap-1">
  //   <div className="h-3 w-3 rounded-full bg-red-500"></div>
  //   <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
  //   <div className="h-3 w-3 rounded-full bg-green-500"></div>
  // </div>

  <div className="absolute inset-y-0 right-6 flex items-center gap-3 text-zinc-700">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-minus h-4 w-4"
    >
      <path d="M5 12h14"></path>
    </svg>
    <svg
      className="h-4 w-4 stroke-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-x h-4 w-4"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  </div>
)
