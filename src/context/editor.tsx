'use client'

import { createContext, useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'

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
  const [clip, setClip, updateClip] = useSessionStorage<Clip>(
    'clip',
    editor.clip
  )
  const [data, setData] = useLocalStorage<ExportData[]>('data', editor.data)
  const pathname = usePathname()

  useEffect(() => {
    setDisabled(false)
  }, [pathname])

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
