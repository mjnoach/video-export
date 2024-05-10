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

const FORMATS: ExportFormat[] = ['mp4', 'gif', 'mp3']

type ExtensionSelectorProps = {
  disabled: boolean
}

export function ExtensionSelector({ disabled }: ExtensionSelectorProps) {
  const editor = useContext(EditorContext)
  const defaultValue = FORMATS[0]

  useEffect(() => {
    editor.updateClip({ format: defaultValue })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value: ExportFormat) =>
        editor.updateClip({ format: value })
      }
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
          {FORMATS.map((format) => (
            <SelectItem
              key={format}
              value={format}
              className="focus:bg-secondary-1"
            >
              {`.${format}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
