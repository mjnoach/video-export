import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { getReadableDuration } from '@/lib/utils/time'

import { EditorContext } from './context/editor'
import { Nav } from './nav'

import { GripVertical, Pin, PinOff, Plus, Trash2 } from 'lucide-react'

export const Drawer = () => {
  const [isPinned, setPinned] = useState(false)
  const { storage } = useContext(EditorContext)

  useEffect(() => {
    setPinned(false)
  }, [])

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen -translate-x-52 overflow-y-auto border-r border-zinc-800 bg-black bg-opacity-70 backdrop-blur-md transition-transform hover:-translate-x-0',
        isPinned ? '-translate-x-0' : ''
      )}
    >
      <div>
        <div className="relative mb-12">
          <div className="invisible">
            <Nav />
          </div>
          <PinButton
            className="absolute right-0 top-12 mr-4"
            isPinned={isPinned}
            setPinned={setPinned}
          />
        </div>
        <ul className="flex flex-col items-center gap-4 px-4">
          {[...storage].map((obj, i) => (
            <DrawerItem key={i} obj={obj} />
          ))}
          <li className="action center aspect-video w-32">
            <Plus className="stroke-zinc-400" />
          </li>
        </ul>
      </div>
      <div className="flex items-center">
        <GripVertical className="stroke-zinc-800" />
      </div>
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
    <li className="group/item flex aspect-video w-44 cursor-pointer select-none rounded-lg border border-zinc-700 bg-black transition">
      <Link href={obj.url} className="w-full" target="_blank">
        <div className="grid h-full grid-cols-3 content-between p-1">
          <div className="col-span-2 text-zinc-400">
            {getReadableDuration(obj.duration)}
          </div>
          <button
            onClick={handleClick}
            className={
              'action invisible flex h-7 w-7 items-center justify-center place-self-end hover:!border-destructive hover:!bg-destructive group-hover/item:visible'
            }
          >
            <Trash2 className="drawer-icon stroke-zinc-400" />
          </button>
          <div className="col-span-2 w-full truncate whitespace-nowrap text-zinc-300">
            {obj.id}
          </div>
          <div className="place-self-end text-zinc-400">{extension}</div>
        </div>
      </Link>
    </li>
  )
}

type PinButtonProps = DefaultProps & {
  isPinned: boolean
  setPinned: (state: boolean) => void
}

const PinButton = ({ isPinned, setPinned, className }: PinButtonProps) => {
  return (
    <button
      onClick={() => setPinned(!isPinned)}
      className={cn(
        className,
        'action flex h-7 w-7 items-center justify-center place-self-end'
      )}
    >
      {isPinned ? (
        <PinOff className={'drawer-icon stroke-zinc-400'} />
      ) : (
        <Pin className={'drawer-icon stroke-zinc-400'} />
      )}
    </button>
  )
}
