import { useContext } from 'react'

import Link from 'next/link'

import { EditorContext } from './context/editor'
import { Nav } from './nav'

import { GripVertical, Plus, Trash2 } from 'lucide-react'

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
        {[
          ...storage,
          {
            id: '1',
            url: '',
          },
          {
            id: '0',
            url: '',
          },
        ].map((obj, i) => (
          <DrawerItem key={i} obj={obj} />
        ))}
        <li className="flex aspect-video w-32 cursor-pointer select-none items-center justify-center rounded-lg border bg-gray-900 p-2 transition hover:border-none hover:bg-gray-800">
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
  // const id = obj.url?.replace('blob:http://localhost:3000/', '') ?? index + 1

  function handleClick(e: any) {
    e.preventDefault()
    removeObject(obj.id)
  }

  return (
    <Link href={obj.url} target="_blank">
      <li className="group flex aspect-video w-32 cursor-pointer select-none items-end justify-between rounded-lg border bg-black transition hover:border-brand">
        <div className="overflow-clip truncate whitespace-nowrap pb-1 pl-1">
          {obj.id}
        </div>
        <button
          onClick={handleClick}
          className={'invisible self-start p-1 text-white group-hover:visible'}
        >
          <div className="rounded-md bg-zinc-600 p-1">
            <Trash2 className="h-4 w-4" />
          </div>
          {/* <ArrowDownToLine /> */}
          {/* <Eye /> */}
        </button>
      </li>
    </Link>
  )
}
