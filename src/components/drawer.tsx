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
        !storage.length
          ? '-translate-x-[100%]'
          : '-translate-x-[calc(100%-1.5rem)]',
        'fixed left-0 top-0 z-40 flex h-screen border-r border-secondary-1 bg-black bg-opacity-70 backdrop-blur-md transition-transform hover:-translate-x-0',
        isPinned ? '-translate-x-0' : ''
      )}
    >
      <div className="overflow-y-auto">
        <div className="relative">
          <div className="invisible">
            <Nav />
          </div>
          <PinButton
            className="absolute right-0 top-12"
            isPinned={isPinned}
            setPinned={setPinned}
          />
        </div>
        <ul className="my-12 mb-24 ml-6 flex w-44 flex-col items-center gap-4">
          {storage.map((obj, i) => (
            <DrawerItem key={i} obj={obj} />
          ))}
          {/* <NewItemButton /> */}
        </ul>
      </div>
      <div className="flex w-6 items-center">
        <GripVertical className="text-secondary-2" />
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
    <li
      style={{
        backgroundImage: obj.thumbnail ? `url(${obj.thumbnail})` : '',
      }}
      className={cn(
        'group/item flex aspect-video w-44 cursor-pointer select-none rounded-lg border border-secondary-2 bg-black transition',
        'bg-black',
        obj.thumbnail ? 'bg-contain bg-center bg-no-repeat' : 'bg-black'
      )}
    >
      <Link href={obj.url} className="w-full" target="_blank">
        <div className="grid h-full grid-cols-3 content-between p-1">
          <div className="bg-black/ px-1.5/ col-span-2 w-fit text-primary-2">
            {getReadableDuration(obj.duration)}
          </div>
          <button
            onClick={handleClick}
            className={
              'action invisible flex h-7 w-7 items-center justify-center place-self-end hover:!border-destructive hover:!bg-destructive group-hover/item:visible'
            }
          >
            <Trash2 className="drawer-icon" />
          </button>
          <div className="bg-black/ px-1.5/ col-span-2 w-fit max-w-full truncate whitespace-nowrap">
            {obj.id}
          </div>
          <div className="bg-black/ px-1.5/ w-fit place-self-end text-player">
            {extension}
          </div>
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
        <PinOff className={'drawer-icon'} />
      ) : (
        <Pin className={'drawer-icon'} />
      )}
    </button>
  )
}

const NewItemButton = () => (
  <li className="action center aspect-video w-32">
    <Plus />
  </li>
)
