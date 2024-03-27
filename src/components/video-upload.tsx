import { useContext, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { EditorContext } from './context/editor'

type VideoUploadProps = DefaultProps & {
  disabled?: boolean
  setLoaded: (state: boolean) => void
}

export function VideoUpload({ disabled = false, setLoaded }: VideoUploadProps) {
  const searchParams = useSearchParams()
  const videoUrl = searchParams.get('videoUrl') ?? ''
  const [isLoading, setLoading] = useState(false)

  const { updateClip } = useContext(EditorContext)

  async function handleLoadRemote() {
    updateClip({ url: videoUrl })
    setLoaded(true)
  }

  function handleLoadLocal(e: any) {
    const file = e.target.files[0] as File
    const objectURL = URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    updateClip({
      fromLocalSource: true,
      url: objectURL,
      title: file.name,
    })
    setLoaded(true)
  }

  return (
    <div className="flex flex-col items-center space-y-10">
      <UploadInput accept="video/*" onChange={handleLoadLocal} />
      <Button
        className="action h-8"
        onClick={handleLoadRemote}
        disabled={isLoading}
      >
        Load Video
      </Button>
    </div>
  )
}

type UploadInputProps = DefaultProps & {
  accept?: string
  onChange: (info: any) => void
}

const UploadInput = (props: UploadInputProps) => {
  // const supportedFormats = 'SVG, PNG, JPG or GIF (MAX. 800x400px)'
  const supportedFormats = 'MP4,MOV'
  return (
    <div>
      <label
        htmlFor="file"
        className="center action aspect-video h-64 rounded-lg border-2 border-dashed"
      >
        <UploadIcon />
        <p className="mb-2 text-sm text-primary-2">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-primary-3">
          {supportedFormats.replaceAll(',', ', ')}
        </p>
        <input
          onChange={props.onChange}
          id="file"
          type="file"
          accept={supportedFormats
            .split(',')
            .map((f) => `.${f}`)
            .join(',')}
          className="hidden"
        />
      </label>
    </div>
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
