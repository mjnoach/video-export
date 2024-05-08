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

type ExportError = string
// {
//   name: string
//   message: string
// }

type ProgressData = {
  frames: number
  currentFps: number
  currentKbps: number
  targetSize: number
  timemark: string
}
