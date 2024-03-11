type DefaultProps = React.HTMLAttributes<HTMLElement>

type SourceVideo = {
  url: string
  title?: string
}

type Clip = {
  start: number
  end: number
  extension: string
  sourceVideo: SourceVideo
}

type ExportedObj = {
  id: string
  url: string
}
