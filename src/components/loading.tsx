import { Loader2 } from 'lucide-react'

export const Loading = ({ children }: DefaultProps) => {
  return (
    <div className="absolute flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <Loader2 className="fixed h-16 w-16 animate-spin" />
      {children && <div className="h-32" />}
      {children}
    </div>
  )
}
