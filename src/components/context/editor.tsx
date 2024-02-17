'use client'

import { createContext, useEffect, useState } from 'react'

import { persist, restore } from '@/lib/utils'

type EditorActions = {
  previewVideo: null | (() => void)
  exportVideo: null | (() => Promise<void>)
}

export const EditorContext = createContext({
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
  disabled: false,
  setDisabled: (disabled: boolean) => {},
  storage: [] as Video[],
  storeVideo: (video: Video) => {},
})

const STORAGE_KEY = 'editor-storage'

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)
  const [disabled, setDisabled] = useState(false)
  const [storage, setStorage] = useState([] as Video[])

  function storeVideo(video: Video) {
    setStorage([video, ...storage])
    persist(STORAGE_KEY, storage)
  }

  useEffect(() => {
    const restoredStorage = restore(STORAGE_KEY) as Video[]
    if (restoredStorage?.length) setStorage(restoredStorage)
  }, [])

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        disabled,
        setDisabled,
        storage,
        storeVideo,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
