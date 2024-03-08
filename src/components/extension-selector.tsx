import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const EXTENSIONS = ['.mp4', '.gif']

type ExtensionSelectorProps = {
  disabled: boolean
}

export function ExtensionSelector({ disabled }: ExtensionSelectorProps) {
  return (
    <Select defaultValue={EXTENSIONS[0]} disabled={disabled}>
      <SelectTrigger className="h-8 w-20 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800/50 text-zinc-300 transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50">
        <SelectValue placeholder={EXTENSIONS[0]} />
      </SelectTrigger>
      <SelectContent
        className="border-zinc-700 bg-zinc-900"
        position="item-aligned"
      >
        <SelectGroup>
          {EXTENSIONS.map((ext) => (
            <SelectItem key={ext} value={ext} className="focus:bg-zinc-800">
              {ext}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}