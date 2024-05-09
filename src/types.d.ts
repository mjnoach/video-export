type DefaultProps = React.HTMLAttributes<HTMLElement>

type ExportService = {
  exportClip: (data: Clip) => void
  progress: number | null
  data: ExportData | null
  reset: () => void
  error: Error | null
  isSuccess: boolean
  isError: boolean
  isPending: boolean
  warning: string | null
  isReady: boolean
}

type Clip = {
  title: string
  start: number
  duration: number
  extension: string
  url: string
} & (ClientClip | RemoteClip)

type ClientClip = {
  isLocal: true
  file: File
}

type RemoteClip = {
  isLocal: false
  file: Blob
}

type ExportTarget = {
  id: string
  path: string
  duration: number
  format: string
}

type ExportData = ExportTarget & {
  url: string
  thumbnail: string | null
}
