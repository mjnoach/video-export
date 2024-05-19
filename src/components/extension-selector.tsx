import { useContext, useEffect } from 'react'

import { EXPORT_FORMATS } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

type ExtensionSelectorProps = {
  disabled: boolean
}

export function ExtensionSelector({ disabled }: ExtensionSelectorProps) {
  const editor = useContext(EditorContext)
  const defaultValue = EXPORT_FORMATS[0]

  useEffect(() => {
    editor.updateClip({ format: defaultValue })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => editor.updateClip({ format: value })}
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
          {EXPORT_FORMATS.map((format) => (
            <SelectItem
              key={format}
              value={format}
              className="focus:bg-secondary-1"
            >
              {format.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
