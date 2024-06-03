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
  ffmpeg: {} as FFmpeg | null,
  loaded: false,
  clip: {
    start: 0,
    duration: 0,
  } as Clip,
  setClip: (clip: Clip) => {},
  updateClip: (data: Partial<Clip>) => {},
  isDisabled: false,
  setDisabled: (state: boolean) => {},
  isProcessing: false,
  setProcessing: (isProcessing: boolean) => {},
  progress: null as null | number,
  setProgress: (progress: null | number) => {},
  warning: null as null | string,
  setWarning: (warning: string) => {},
  error: null as null | Error,
  setError: (error: Error) => {},
  data: null as null | ExportData,
  setData: (data: ExportData) => {},
  clear: () => {},
  storage: [] as ExportData[],
  storeExport: (exportData: ExportData) => {},
  removeExport: (exportId: string) => {},
}

export const EditorContext = createContext(editor)

export const EditorProvider = ({ children }: DefaultProps) => {
  const pathname = usePathname()
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [loaded, setLoaded] = useState(ffmpegRef.current?.loaded ?? false)
  const [actions, setActions] = useState({} as EditorActions)
  const [clip, setClip, updateClip] = useSessionStorage<Clip>(
    'clip',
    editor.clip
  )
  const [isDisabled, setDisabled] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const [progress, setProgress] = useState<null | number>(null)
  const [warning, setWarning] = useState<null | string>(null)
  const [error, setError] = useState<null | Error>(null)
  const [data, setData] = useState<null | ExportData>(null)
  const [storage, setStorage] = useLocalStorage<ExportData[]>(
    'storage',
    editor.storage
  )

  useEffect(() => {
    if (ffmpegRef.current === null) ffmpegRef.current = new FFmpeg()
    if (!ffmpegRef.current?.loaded) {
      load().then(setLoaded)
    }
  }, [])

  useEffect(() => {
    clear()
  }, [pathname])

  async function load() {
    const baseUrl = '/ffmpeg/esm'
    console.log('Loading...')
    const loaded = await ffmpegRef.current?.load({
      coreURL: `${baseUrl}/ffmpeg-core.js`,
      wasmURL: `${baseUrl}/ffmpeg-core.wasm`,
      workerURL: `${baseUrl}/ffmpeg-core.worker.js`,
    })
    if (ffmpegRef.current?.loaded) console.log('FFmpeg loaded!')
    else console.log('FFmpeg failed to load.')
    return ffmpegRef.current?.loaded ?? false
  }

  function storeExport(exportData: ExportData) {
    setStorage([exportData, ...storage])
  }

  function removeExport(exportId: string) {
    setStorage(storage.filter((exportData) => exportData.id !== exportId))
  }

  function clear() {
    setError(null)
    setData(null)
    setWarning(null)
    setDisabled(false)
  }

  return (
    <EditorContext.Provider
      value={{
        actions,
        setActions,
        ffmpeg: ffmpegRef.current,
        loaded,
        clip,
        setClip,
        updateClip,
        isDisabled,
        setDisabled,
        isProcessing,
        setProcessing,
        progress,
        setProgress,
        warning,
        setWarning,
        error,
        setError,
        data,
        setData,
        clear,
        storage,
        storeExport,
        removeExport,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
