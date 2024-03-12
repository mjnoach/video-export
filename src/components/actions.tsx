import { useContext } from 'react'

import { EditorContext } from './context/editor'
import { ExtensionSelector } from './extension-selector'
import { Button } from './ui/button'

export const Actions = () => {
  const { actions, disabled, clip, updateClip } = useContext(EditorContext)

  async function handleExport() {
    actions.exportClip?.(clip).catch((e: any) => {
      console.error(e)
    })
  }

  return (
    <div className="mx-auto flex select-none items-center gap-4 rounded-lg bg-zinc-900 p-4 drop-shadow-xl">
      <Button
        disabled={!actions.previewClip || disabled}
        onClick={() => actions.previewClip?.(clip)}
        className="h-8 whitespace-nowrap rounded-md border border-brand bg-brand/50 text-zinc-300 transition-colors hover:bg-brand/60 disabled:pointer-events-none disabled:opacity-50"
      >
        Preview
      </Button>
      <Button
        disabled={!actions.exportClip || disabled}
        onClick={handleExport}
        className="h-8 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800/50 text-zinc-300 transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
      >
        Export
      </Button>
      <ExtensionSelector
        onValueChange={(value) => updateClip({ extension: value })}
        disabled={!actions.previewClip || disabled}
      />
    </div>
  )
}
