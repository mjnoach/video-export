import { Loader2 } from 'lucide-react'

export const Loading = ({ children }: DefaultProps) => {
  return (
    <div className="/bg-opacity-70 /backdrop-blur-sm absolute flex h-full w-full flex-col items-center justify-center bg-black">
      <Loader2 className="fixed h-16 w-16 animate-spin" />
      {children && <div className="h-32" />}
      {children}
    </div>
  )
}
