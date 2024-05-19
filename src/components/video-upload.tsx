import { useContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import { UPLOAD_FORMATS } from '@/lib/utils'

import { EditorContext } from '../context/editor'

type VideoUploadProps = DefaultProps & {
  disabled?: boolean
}

export function VideoUpload({ disabled = false }: VideoUploadProps) {
  const [isLoading, setLoading] = useState(false)
  const editor = useContext(EditorContext)
  const router = useRouter()

  function handleLoadLocal(e: any) {
    const file = e.target.files[0] as File
    const objectURL = URL.createObjectURL(file)
    editor.setClip({
      isLocal: true,
      url: objectURL,
      title: file.name,
    } as Clip)
    router.push(`/edit`)
  }

  return <UploadInput accept="video/*" onChange={handleLoadLocal} />
}

type UploadInputProps = DefaultProps & {
  accept?: string
  onChange: (info: any) => void
}

const UploadInput = (props: UploadInputProps) => {
  return (
    <label
      htmlFor="file"
      className="center panel aspect-video w-full rounded-lg border-dashed !border-secondary-2"
    >
      <UploadIcon />
      <p className="mb-2 text-primary-2">Click or drag and drop</p>
      <p className="text-sm text-primary-3">
        {UPLOAD_FORMATS.join(', ').toUpperCase()}
      </p>
      <input
        onChange={props.onChange}
        id="file"
        type="file"
        accept={UPLOAD_FORMATS.map((f) => `.${f}`).join(',')}
        className="hidden"
      />
    </label>
  )
}

const UploadIcon = () => (
  <svg
    className="mb-4 h-8 w-8"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 16"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    />
  </svg>
)
