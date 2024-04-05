import { useContext } from 'react'

import { cn } from '@/lib/utils'

import { EditorContext } from './context/editor'
import { ExtensionSelector } from './extension-selector'
import { Button } from './ui/button'

export const Actions = () => {
  const { clip, ...editor } = useContext(EditorContext)

  async function handleExport() {
    editor.actions.exportClip?.(clip).catch((e: any) => {
      console.error(e)
    })
  }

  return (
    <div
      className={cn(
        'mx-auto flex select-none items-center gap-4 rounded-lg bg-zinc-900 p-4 drop-shadow-xl',
        editor.isDisabled || !clip.url ? 'disable' : ''
      )}
    >
      <Button
        disabled={editor.isDisabled}
        onClick={() => editor.actions.previewClip?.(clip)}
        className="action action-brand h-8"
      >
        Preview
      </Button>
      <Button
        disabled={editor.isDisabled}
        onClick={handleExport}
        className="action h-8"
      >
        Export
      </Button>
      <ExtensionSelector disabled={editor.isDisabled} />
    </div>
  )
}
