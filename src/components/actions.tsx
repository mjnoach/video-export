import { useContext } from 'react'

import { cn } from '@/lib/utils'

import { EditorContext } from './context/editor'
import { ExtensionSelector } from './extension-selector'
import { Button } from './ui/button'

export const Actions = () => {
  const { actions, isProcessing, clip, updateClip } = useContext(EditorContext)

  async function handleExport() {
    actions.exportClip?.(clip).catch((e: any) => {
      console.error(e)
    })
  }

  return (
    <div
      className={cn(
        isProcessing || !clip.sourceVideo ? 'disable' : '',
        'mx-auto flex select-none items-center gap-4 rounded-lg bg-zinc-900 p-4 drop-shadow-xl'
      )}
    >
      <Button
        onClick={() => actions.previewClip?.(clip)}
        className="action brand h-8"
      >
        Preview
      </Button>
      <Button onClick={handleExport} className="action h-8">
        Export
      </Button>
      <ExtensionSelector
        onValueChange={(value) => updateClip({ extension: value })}
      />
    </div>
  )
}
