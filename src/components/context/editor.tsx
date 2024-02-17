'use client'

import { createContext, useState } from 'react'

type EditorActions = {
  previewVideo: null | (() => void)
  exportVideo: null | (() => void)
}

export const EditorContext = createContext({
  actions: {} as EditorActions,
  setActions: (actions: EditorActions) => {},
})

export const EditorProvider = ({ children }: DefaultProps) => {
  const [actions, setActions] = useState({} as EditorActions)

  return (
    <EditorContext.Provider value={{ actions, setActions }}>
      {children}
    </EditorContext.Provider>
  )
}
