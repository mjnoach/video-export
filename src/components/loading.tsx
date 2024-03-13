import { cn } from '@/lib/utils'

import { Loader2 } from 'lucide-react'

export const Loading = ({ className, children }: DefaultProps) => {
  return (
    <div
      className={cn(
        // /backdrop-blur-sm /bg-opacity-70
        'absolute flex h-full w-full flex-col items-center justify-center bg-black',
        className
      )}
    >
      <Loader2 className="fixed h-16 w-16 animate-spin" />
      {children && <div className="h-32" />}
      {children}
    </div>
  )
}
