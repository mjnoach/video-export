import { useContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import { EditorContext } from '../context/editor'

import { Ban, Upload } from 'lucide-react'

type VideoUploadProps = DefaultProps & {
  disabled?: boolean
}

export function VideoUpload({ disabled = false }: VideoUploadProps) {
  const [invalidType, setInvalidType] = useState(false)
  const editor = useContext(EditorContext)
  const router = useRouter()

  function handleUpload(file: File) {
    const objectURL = URL.createObjectURL(file)
    editor.setClip({
      isLocal: true,
      url: objectURL,
      title: file.name,
    } as Clip)
    router.push(`/edit`)
  }

  return (
    <label
      htmlFor="dropzone"
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file.type.startsWith('video/')) {
          setInvalidType(false)
          return
        }
        handleUpload(file)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        const item = e.dataTransfer.items[0]
        if (!item.type.startsWith('video/')) {
          setInvalidType(true)
        }
      }}
      onDragLeave={() => setInvalidType(false)}
      className="center panel aspect-video w-full rounded-lg border-dashed !border-secondary-2"
    >
      {invalidType ? (
        <Ban className="pointer-events-none mb-4 h-8 w-8" />
      ) : (
        <Upload className="pointer-events-none mb-4 h-8 w-8" />
      )}
      <p className="mb-2 text-primary-2">
        {invalidType ? 'Invalid file type' : 'Click or drag and drop'}
      </p>
      <input
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
        id="dropzone"
        type="file"
        accept="video/*"
        className="hidden"
      />
    </label>
  )
}
