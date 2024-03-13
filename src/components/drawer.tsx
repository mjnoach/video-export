import { useContext } from 'react'

import Link from 'next/link'

import { EditorContext } from './context/editor'
import { Nav } from './nav'

import { GripVertical, Plus, Trash2 } from 'lucide-react'

export const Drawer = () => {
  const { storage } = useContext(EditorContext)

  return (
    <div className="fixed left-0 top-0 z-40 h-screen -translate-x-[85%] overflow-y-auto border-r border-zinc-800 bg-black bg-opacity-70 p-4 pt-12 backdrop-blur-md transition-transform hover:-translate-x-[0%]">
      <div className="invisible">
        <Nav />
      </div>
      <div className="absolute bottom-0 right-0 top-0 flex items-center text-zinc-800">
        <GripVertical />
      </div>

      <ul className="flex flex-col items-center gap-4 p-4">
        {[
          ...storage,
          {
            id: '0',
            path: '',
            url: '',
          },
        ].map((obj, i) => (
          <DrawerItem key={i} obj={obj} />
        ))}
        <li className="action center aspect-video w-32">
          <Plus />
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

  function handleClick(e: any) {
    e.preventDefault()
    removeObject(obj.id)
  }

  return (
    <Link href={obj.url} target="_blank">
      <li className="group flex aspect-video w-32 cursor-pointer select-none items-end justify-between rounded-lg border border-zinc-700 bg-black transition">
        <div className="overflow-clip truncate whitespace-nowrap pb-1 pl-1">
          {obj.id}
        </div>
        <button
          onClick={handleClick}
          className={'invisible self-start p-1 group-hover:visible'}
        >
          <div className="action p-1 hover:!border-destructive hover:!bg-destructive">
            <Trash2 className="h-4 w-4" />
          </div>
          {/* <ArrowDownToLine /> */}
          {/* <Eye /> */}
        </button>
      </li>
    </Link>
  )
}
