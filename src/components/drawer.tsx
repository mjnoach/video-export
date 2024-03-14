import { useContext } from 'react'

import Link from 'next/link'

import { EditorContext } from './context/editor'
import { Nav } from './nav'

import { GripVertical, Plus, Trash2 } from 'lucide-react'

export const Drawer = () => {
  const { storage } = useContext(EditorContext)
  const dummy: ExportedObj = {
    id: '0',
    path: '',
    url: '',
    format: 'gif',
  }

  return (
    <div className="fixed left-0 top-0 z-40 h-screen -translate-x-[85%] overflow-y-auto border-r border-zinc-800 bg-black bg-opacity-70 p-4 pt-12 backdrop-blur-md transition-transform hover:-translate-x-[0%]">
      <div className="invisible">
        <Nav />
      </div>
      <div className="absolute bottom-0 right-0 top-0 flex items-center text-zinc-800">
        <GripVertical />
      </div>

      <ul className="flex flex-col items-center gap-4 p-4">
        {[...storage, dummy].map((obj, i) => (
          <DrawerItem key={i} obj={obj} />
        ))}
        <li className="action center aspect-video w-32">
          <Plus className="stroke-zinc-400" />
        </li>
      </ul>
    </div>
  )
}

type DrawerItemProps = {
  obj: ExportedObj
}

const DrawerItem = ({ obj }: DrawerItemProps) => {
  const { removeObject } = useContext(EditorContext)
  const extension = `.${obj.format}`

  function handleClick(e: any) {
    e.preventDefault()
    removeObject(obj.id)
  }

  return (
    <Link href={obj.url} target="_blank">
      <li className="group/item flex aspect-video w-32 cursor-pointer select-none items-end justify-between rounded-lg border border-zinc-700 bg-black transition">
        <div className="my-1 ml-1 overflow-clip">
          <div className="truncate whitespace-nowrap text-zinc-300">
            {obj.id}
          </div>
        </div>
        <div className="m-1 flex h-full flex-col justify-between">
          <button
            onClick={handleClick}
            className={
              'action invisible flex h-7 w-7 items-center justify-center self-end p-1 hover:!border-destructive hover:!bg-destructive group-hover/item:visible'
            }
          >
            <Trash2 className="w-full stroke-zinc-400" />
            {/* <ArrowDownToLine /> */}
            {/* <Eye /> */}
          </button>
          <div className="text-zinc-400">{extension}</div>
        </div>
      </li>
    </Link>
  )
}
