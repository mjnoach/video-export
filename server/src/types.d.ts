type Clip = {
  title: string
  start: number
  duration: number
  extension: string
  url: string
  isClientUpload: boolean
} & {
  isClientUpload: true
  file: File
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
