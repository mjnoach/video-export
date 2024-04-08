import { useContext, useEffect } from 'react'

import { EditorContext } from '../context/editor'
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
  disabled: boolean
}

export function ExtensionSelector({ disabled }: ExtensionSelectorProps) {
  const editor = useContext(EditorContext)
  const defaultValue = EXTENSIONS[0]

  useEffect(() => {
    editor.updateClip({ extension: defaultValue })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => editor.updateClip({ extension: value })}
      disabled={disabled}
    >
      <SelectTrigger className="action h-8 w-20">
        <SelectValue placeholder={defaultValue} />
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
