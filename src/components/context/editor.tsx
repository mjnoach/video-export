'use client'

import { createContext, useEffect, useState } from 'react'

import { persist, restore } from '@/lib/utils/storage'

export type EditorActions = {
  previewClip: (clip: Clip) => void
  exportClip: (clip: Clip) => Promise<void>
}

// type EditorData = ExportData & {
//   status: 'started' | 'failed' | 'complete'
//   progress?: number
// }

const editor = {
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
  isDisabled: false,
  setDisabled: (state: boolean) => {},
  data: [] as ExportData[],
  storeItem: (item: ExportData) => {},
  removeItem: (id: string) => {},
  clip: {} as Clip,
  updateClip: (clip: Partial<Clip>) => {},
  reset: () => {},
}

export const EditorContext = createContext(editor)

const STORAGE_KEY = 'editor-storage'

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState(editor.actions)
  const [isDisabled, setDisabled] = useState(editor.isDisabled)
  const [data, setData] = useState(editor.data)
  const [clip, setClip] = useState(editor.clip)
  // const [progress, setProgress] = useState(
  //   {} as { [id: ExportData['id']]: string }
  // )

  useEffect(() => {
    const restoredStorage = restore(STORAGE_KEY) as ExportData[]
    if (restoredStorage?.length) setData(restoredStorage)
  }, [])

  function storeItem(item: ExportData) {
    const restoredStorage = restore(STORAGE_KEY) as ExportData[]
    const newStorage = [item, ...(restoredStorage ?? [])]
    setData(newStorage)
    persist(STORAGE_KEY, newStorage)
  }

  function removeItem(id: string) {
    const newStorage = data.filter((item) => item.id !== id)
    setData(newStorage)
    persist(STORAGE_KEY, newStorage)
    setData(newStorage)
  }

  function updateClip(clipData: Partial<Clip>) {
    const newClip = {
      ...clip,
      ...clipData,
    }
    setClip(newClip as Clip)
  }

  function reset() {
    setDisabled(false)
    setClip({} as Clip)
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        isDisabled,
        setDisabled,
        data,
        storeItem,
        removeItem,
        clip,
        updateClip,
        reset,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
