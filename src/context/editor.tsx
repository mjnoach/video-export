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
  data: [] as ExportData[],
  storeExport: (obj: ExportData) => {},
  removeExport: (id: string) => {},
  clip: {
    start: 0,
    duration: 0,
  } as Clip,
  setClip: (clip: Clip) => {},
  updateClip: (data: Partial<Clip>) => {},
}

export const EditorContext = createContext(editor)

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)
  const [isDisabled, setDisabled] = useState(false)
  const [clip, setClip, updateClip] = useSessionState<Clip>('clip', editor.clip)
  const [data, setData] = usePersistentState<ExportData[]>('data', editor.data)

  const storeExport = (obj: ExportData) => {
    setData([obj, ...data])
  }

  const removeExport = (id: string) => {
    setData(data.filter((obj) => obj.id !== id))
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        isDisabled,
        setDisabled,
        data,
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
