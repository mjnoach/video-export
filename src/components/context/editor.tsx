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
  storage: [] as Video[],
  storeVideo: (video: Video) => {},
  clip: {} as Clip,
  updateClip: (clip: Partial<Clip>) => {},
})

const STORAGE_KEY = 'editor-storage'

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)
  const [disabled, setDisabled] = useState(false)
  const [storage, setStorage] = useState([] as Video[])
  const [clip, setClip] = useState({} as Clip)

  useEffect(() => {
    const restoredStorage = restore(STORAGE_KEY) as Video[]
    if (restoredStorage?.length) setStorage(restoredStorage)
  }, [])

  function storeVideo(video: Video) {
    const newStorage = [video, ...storage]
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
        storeVideo,
        clip,
        updateClip,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
