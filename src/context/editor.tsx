'use client'

import { createContext, useState } from 'react'

import { usePersistentState } from '@/hooks/usePersistentState'
import { useSessionState } from '@/hooks/useSessionState'

export type EditorActions = {
  previewClip: (clip: Clip) => void
  exportClip: (clip: Clip) => Promise<void>
}

const editor = {
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
  isDisabled: false,
  setDisabled: (state: boolean) => {},
  exports: [] as ExportData[],
  storeExport: (item: ExportData) => {},
  removeExport: (id: string) => {},
  clip: {
    start: 0,
    end: 0,
  } as Clip,
  setClip: (clip: Clip) => {},
  updateClip: (data: Partial<Clip>) => {},
}

export const EditorContext = createContext(editor)

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)
  const [isDisabled, setDisabled] = useState(false)
  const [clip, setClip, updateClip] = useSessionState<Clip>('clip', editor.clip)
  const [exports, setExports] = usePersistentState<ExportData[]>(
    'exports',
    editor.exports
  )

  const storeExport = (item: ExportData) => {
    setExports([item, ...exports])
  }

  const removeExport = (id: string) => {
    setExports(exports.filter((i) => i.id !== id))
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        isDisabled,
        setDisabled,
        exports,
        storeExport,
        removeExport,
        clip,
        setClip,
        updateClip,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
