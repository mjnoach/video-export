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
