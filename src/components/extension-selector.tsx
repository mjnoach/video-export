import { useEffect } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const EXTENSIONS = ['.mp4', '.gif', '.mp3']

type ExtensionSelectorProps = {
  onValueChange: (value: string) => void
}

export function ExtensionSelector({ onValueChange }: ExtensionSelectorProps) {
  const defaultValue = EXTENSIONS[0]

  useEffect(() => {
    onValueChange(defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className="action h-8 w-20">
        <SelectValue placeholder={EXTENSIONS[0]} />
      </SelectTrigger>
      <SelectContent
        className="border-secondary-2 bg-zinc-900"
        position="item-aligned"
      >
        <SelectGroup>
          {EXTENSIONS.map((ext) => (
            <SelectItem key={ext} value={ext} className="focus:bg-secondary-1">
              {ext}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
