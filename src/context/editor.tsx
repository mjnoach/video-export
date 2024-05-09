'use client'

import { createContext, useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { FFmpeg } from '@ffmpeg/ffmpeg'

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
  ffmpeg: {} as FFmpeg | null,
  ffmpegLoaded: false,
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
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [ffmpegLoaded, setLoaded] = useState(!!ffmpegRef.current?.loaded)

  useEffect(() => {
    if (ffmpegRef.current === null) ffmpegRef.current = new FFmpeg()
    if (!ffmpegRef.current.loaded) {
      loadFfmpeg().then(() => setLoaded(true))
    }
  }, [])

  const baseUrl = '/ffmpeg/esm'

  const loadFfmpeg = async () => {
    console.log('Loading...')
    await ffmpegRef.current!.load({
      coreURL: `${baseUrl}/ffmpeg-core.js`,
      wasmURL: `${baseUrl}/ffmpeg-core.wasm`,
      workerURL: `${baseUrl}/ffmpeg-core.worker.js`,
    })
    console.log('FFmpeg loaded!')
  }

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
        ffmpeg: ffmpegRef.current,
        ffmpegLoaded,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
