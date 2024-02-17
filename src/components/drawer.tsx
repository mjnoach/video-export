import { useContext } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

import { EditorContext } from './context/editor'
import { Nav } from './nav'

import { Eye, GripVertical, Plus } from 'lucide-react'

export const Drawer = () => {
  const { storage } = useContext(EditorContext)

  return (
    <div className="fixed left-0 top-0 z-40 h-screen -translate-x-[85%] overflow-y-auto border-r border-gray-800 bg-black bg-opacity-70 p-4 pt-12 backdrop-blur-md transition-transform hover:-translate-x-[0%]">
      <div className="invisible">
        <Nav />
      </div>
      <div className="absolute bottom-0 right-0 top-0 flex items-center text-gray-800">
        <GripVertical />
      </div>

      <ul className="flex flex-col items-center gap-4 p-4">
        {[...storage, {}, {}].map((video, i) => (
          <DrawerItem key={i} index={i} video={video} />
        ))}
        <li className="drawer-item items-center justify-center bg-gray-900 p-2 hover:border-none hover:bg-gray-800">
          <Plus />
        </li>
      </ul>
    </div>
  )
}

type DrawerItemProps = {
  index: number
  video: Video
}

const DrawerItem = ({ index, video }: DrawerItemProps) => {
  const id = video.url?.replace('blob:http://localhost:3000/', '') ?? index + 1
  const href = video.url ?? ''

  return (
    <Link href={href} target="_blank">
      <li
        // onClick={() => {
        //   console.log('🚀 ~ DrawerItem ~ href:', href)
        // }}
        className="drawer-item group justify-between bg-black hover:border-brand"
      >
        <div className="max-w-16 overflow-clip truncate whitespace-nowrap">
          {id}
        </div>
        <DownloadButton className="invisible group-hover:visible" />
      </li>
    </Link>
  )
}

const DownloadButton = (props: DefaultProps) => {
  function handleDownload(e: any) {
    console.log('🚀 ~ handleDownload ~ handleDownload:')
  }

  return (
    <button
      onClick={handleDownload}
      className={cn(
        props.className,
        'z-10 h-6 w-6 rounded-md bg-zinc-600 px-1 py-1 text-white'
      )}
    >
      {/* <ArrowDownToLine className="h-full w-full" /> */}
      <Eye className="h-full w-full" />
    </button>
  )
}
