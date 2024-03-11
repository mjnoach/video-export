'use client'

import { createContext, useEffect, useState } from 'react'

import { persist, restore } from '@/lib/utils'

type EditorActions = {
  previewClip: (clip: Clip) => void
  exportClip: (clip: Clip) => Promise<void>
}

export const EditorContext = createContext({
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
  disabled: false,
  setDisabled: (disabled: boolean) => {},
  storage: [] as ExportedObj[],
  storeObject: (obj: ExportedObj) => {},
  removeObject: (objId: string) => {},
  clip: {} as Clip,
  updateClip: (clip: Partial<Clip>) => {},
})

const STORAGE_KEY = 'editor-storage'

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)
  const [disabled, setDisabled] = useState(false)
  const [storage, setStorage] = useState([] as ExportedObj[])
  const [clip, setClip] = useState({} as Clip)

  useEffect(() => {
    const restoredStorage = restore(STORAGE_KEY) as ExportedObj[]
    if (restoredStorage?.length) setStorage(restoredStorage)
  }, [])

  function storeObject(obj: ExportedObj) {
    const newStorage = [obj, ...storage]
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
    setClip(newClip)
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        disabled,
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
