import { useContext, useEffect, useState } from 'react'

import { api } from '@/lib/api'

import { EditorContext } from '@/context/editor'

export const useDownloadSource = () => {
  const editor = useContext(EditorContext)
  const [isDownloading, setDownloading] = useState(!editor.clip.isLocal)
  const [downloadError, setDownloadError] = useState<null | Error>(null)

  useEffect(() => {
    if (!editor.clip.isLocal) {
      api
        .downloadClip(editor.clip)
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          editor.updateClip({ url })
        })
        .catch((e) => {
          setDownloadError(e)
        })
        .finally(() => setDownloading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { downloadError, isDownloading }
}
