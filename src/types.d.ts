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
}

type Clip = {
  title: string
  start: number
  duration: number
  extension: string
  url: string
  videoLength: number
} & (ClientClip | RemoteClip)

type ClientClip = {
  isLocal: true
  file: File
}

type RemoteClip = {
  isLocal: false
  file: Blob
}

type ExportSource = string | File | Blob

type ExportTarget = {
  id: string
  path: string
  duration: number
  format: string
  start: number
}

type ExportData = Omit<ExportTarget, 'start'> & {
  url: string
  thumbnail: string | null
}
