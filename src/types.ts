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

type TargetClip = {
  path: string
  duration: number
  format: string
}

type ExportedObj = TargetClip & {
  id: string
  url: string
  thumbnail: string | null
}
