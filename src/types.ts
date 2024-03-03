type DefaultProps = React.HTMLAttributes<HTMLElement>

type Video = {
  path?: string
  url?: string
  obj?: Blob | MediaSource // string | Blob | Buffer | File
}

type Clip = {
  start: number
  end: number
  videoUrl: string
  videoTitle?: string
}
