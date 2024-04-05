import { useContext } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { getReadableDuration } from '@/lib/utils/time'

import { EditorContext } from './context/editor'
import { Nav } from './nav'
import { Progress } from './ui/progress'

import { GripVertical, Loader2, Pin, PinOff, Plus, Trash2 } from 'lucide-react'

export const Drawer = () => {
  const editor = useContext(EditorContext)

  return (
    <div
      className={cn(
        !editor.data.length
          ? '-translate-x-[100%]'
          : '-translate-x-[calc(100%-1.5rem)]',
        'fixed left-0 top-0 z-50 flex h-screen border-r border-secondary-1 bg-black bg-opacity-60 backdrop-blur-md transition-transform hover:-translate-x-0'
      )}
    >
      <div className="overflow-y-auto">
        <div className="relative">
          <div className="invisible">
            <Nav />
          </div>
        </div>
        <ul className="my-12 mb-24 ml-6 flex w-44 flex-col items-center gap-4">
          {/* <PendingItem
            obj={clip}
            // obj={{
            //   id: 'test',
            //   path: '',
            //   duration: 0,
            //   format: 'mp4',
            //   url: '',
            //   thumbnail: null,
            // }}
          /> */}
          {editor.data.map((obj, i) => (
            <Item key={i} obj={obj} />
          ))}
          <NewItem />
        </ul>
      </div>
      <div className="flex w-6 items-center">
        <GripVertical className="text-secondary-2" />
      </div>
    </div>
  )
}

type PendingItemProps = {
  obj: ExportData
}

const PendingItem = ({ obj }: PendingItemProps) => {
  const extension = `.${obj.format}`

  return (
    <li
      style={{
        backgroundImage: obj.thumbnail ? `url(${obj.thumbnail})` : '',
      }}
      className={cn(
        'drawer-item relative flex overflow-hidden',
        obj.thumbnail ? 'bg-contain bg-center bg-no-repeat' : 'bg-black'
      )}
    >
      {/* <div className="absolute inset-0 z-50 rounded-lg bg-black/60"></div> */}
      <div className="grid h-full w-full grid-cols-3 content-between p-1">
        <div className="col-span-2 w-fit select-none text-primary-2">
          {getReadableDuration(obj.duration)}
        </div>
        <div
          className={
            'z-50 flex h-7 w-7 select-none items-center justify-center place-self-end'
          }
        >
          <Loader2 className={'h-6 w-6 animate-spin self-end'} />
        </div>
        <div className="col-span-2 w-fit max-w-full truncate whitespace-nowrap">
          {obj.id}
        </div>
        <div className="w-fit place-self-end text-player">{extension}</div>
      </div>
      <Progress
        value={50}
        className="rounded-lg/ /bg-red-500 absolute bottom-0 z-50 h-1 w-full"
      />
    </li>
  )
}

type ItemProps = {
  obj: ExportData
}

const Item = ({ obj }: ItemProps) => {
  const extension = `.${obj.format}`
  const href = `${process.env.NEXT_PUBLIC_API_URL}${obj.url}`

  return (
    <li
      style={{
        backgroundImage: obj.thumbnail ? `url(${obj.thumbnail})` : '',
      }}
      className={cn(
        'group/item drawer-item flex cursor-pointer transition',
        obj.thumbnail ? 'bg-contain bg-center bg-no-repeat' : 'bg-black'
      )}
    >
      <Link href={href} className="w-full" target="_blank">
        <div className="grid h-full grid-cols-3 content-between p-1">
          <div className="col-span-2 w-fit select-none text-primary-2">
            {getReadableDuration(obj.duration)}
          </div>
          <RemoveButton obj={obj} />
          <div className="col-span-2 w-fit max-w-full truncate whitespace-nowrap">
            {obj.id}
          </div>
          <div className="w-fit place-self-end text-player">{extension}</div>
        </div>
      </Link>
    </li>
  )
}

type RemoveButtonProps = {
  obj: ExportData
}

const RemoveButton = ({ obj }: RemoveButtonProps) => {
  const editor = useContext(EditorContext)

  function handleClick(e: any) {
    e.preventDefault()
    editor.removeItem(obj.id)
  }
  return (
    <button
      onClick={handleClick}
      className={
        'action action-destructive invisible flex h-7 w-7 select-none items-center justify-center place-self-end group-hover/item:visible'
      }
    >
      <Trash2 className="drawer-icon" />
    </button>
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

const NewItem = () => {
  const router = useRouter()
  const editor = useContext(EditorContext)

  function handleClick() {
    router.replace(`/`)
  }

  return (
    <li onClick={handleClick} className="action center drawer-item w-32">
      <Plus />
    </li>
  )
}
