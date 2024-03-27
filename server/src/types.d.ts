type Clip = {
  title: string
  start: number
  end: number
  extension: string
  url: string
  fromLocalSource: boolean
}

type ExportTarget = {
  path: string
  duration: number
  format: string
}

type ExportedObj = ExportTarget & {
  id: string
  url: string
  thumbnail: string | null
}
