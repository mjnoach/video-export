'use client'

import { createContext, useEffect, useState } from 'react'

import { persist, restore } from '@/lib/utils/storage'

export type EditorActions = {
  previewClip: (clip: Clip) => void
  exportClip: (clip: Clip) => Promise<void>
}

const editor = {
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
  isDisabled: false,
  setDisabled: (state: boolean) => {},
  storage: [] as ExportData[],
  storeObject: (obj: ExportData) => {},
  removeObject: (objId: string) => {},
  clip: {} as Clip,
  updateClip: (clip: Partial<Clip>) => {},
}

export const EditorContext = createContext(editor)

const STORAGE_KEY = 'editor-storage'

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState(editor.actions)
  const [isDisabled, setDisabled] = useState(editor.isDisabled)
  const [storage, setStorage] = useState(editor.storage)
  const [clip, setClip] = useState(editor.clip)

  useEffect(() => {
    const restoredStorage = restore(STORAGE_KEY) as ExportData[]
    if (restoredStorage?.length) setStorage(restoredStorage)
  }, [])

  function storeObject(obj: ExportData) {
    const restoredStorage = restore(STORAGE_KEY) as ExportData[]
    const newStorage = [obj, ...restoredStorage]
    setStorage(newStorage)
    persist(STORAGE_KEY, newStorage)
  }

  function removeObject(id: string) {
    const newStorage = storage.filter((obj) => obj.id !== id)
    setStorage(newStorage)
    persist(STORAGE_KEY, newStorage)
  }

  function updateClip(clipData: Partial<Clip>) {
    const newClip = {
      ...clip,
      ...clipData,
    }
    setClip(newClip as Clip)
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        isDisabled,
        setDisabled,
        storage,
        storeObject,
        removeObject,
        clip,
        updateClip,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
