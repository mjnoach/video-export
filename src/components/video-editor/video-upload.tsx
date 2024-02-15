import { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'

type VideoUploadProps = DefaultProps & {
  disabled: boolean
  setVideo: (video: Video) => void
}

export function VideoUpload({ disabled, setVideo }: VideoUploadProps) {
  const [isLoading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const videoUrl = searchParams.get('videoUrl') ?? ''

  async function handleLoad() {
    setLoading(true)

    // * DIRECT FETCH ATTEMPT

    // const res = await fetch(videoUrl, {
    //   headers: {
    //     'Content-Type': 'video/mp4',
    //     'Content-Disposition': `attachment; filename="video.mp4"`,
    //     // 'Cross-Origin-Resource-Policy': 'cross-origin',
    //   },
    // })

    // * BACKEND FETCH

    const res: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/edit/api`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      }
    )

    const data = await res.json()
    console.log('🚀 ~ handleLoad ~ data:', data)
    setVideo({ path: data.filePath })

    // const videoBlob = await res.blob()
    // const videoStream = await videoBlob.stream()

    // const videoData = await res.arrayBuffer()
    // console.log('🚀 ~ handleLoad ~ videoData:', videoData)
    // const mediaSource = new MediaSource()
    // mediaSource.addEventListener('sourceopen', function () {
    //   const videoSourceBuffer = mediaSource.addSourceBuffer(
    //     'video/mp4; codecs="avc1.64001e"'
    //   )
    //   videoSourceBuffer.appendBuffer(videoData)
    // })
    // setVideo(mediaSource)

    setLoading(false)
  }

  function handleUpload(e: any) {
    const file = e.target.files[0] as File
    console.log('🚀 ~ file:', file)
    console.log('🚀 ~ file.name:', file.name)

    // const blobUrl = URL.createObjectURL(file)
    // console.log('🚀 ~ blobUrl:', blobUrl)

    setVideo({ obj: file })
  }

  return (
    <div className="w-full space-y-10">
      <Upload accept="video/*" onChange={handleUpload} />
      <Button
        className="mx-auto flex"
        onClick={handleLoad}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Load Video
      </Button>
    </div>
  )
}

type UploadProps = DefaultProps & {
  accept?: string
  onChange: (info: any) => void
}

const Upload = (props: UploadProps) => {
  const supportedFormats = 'SVG, PNG, JPG or GIF (MAX. 800x400px)'
  return (
    <div>
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 mx-auto flex aspect-video h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {/* {supportedFormats} */}
          </p>
        </div>
        <input
          onChange={props.onChange}
          id="dropzone-file"
          type="file"
          className="hidden"
        />
      </label>
    </div>
  )
}
