import { cn } from '@/lib/utils'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

type OverlayPropps = DefaultProps & {
  type: 'loading' | 'error' | 'success'
  isOpen?: boolean
  enableDismiss?: boolean
  title?: string
}

export const Overlay = ({ children, type, isOpen, title }: OverlayPropps) => {
  const iconClassName = 'h-16 w-16'

  const Icon = {
    loading: <Loader2 className={cn(iconClassName, 'animate-spin')} />,
    error: (
      <AlertTriangle className={cn(iconClassName, 'stroke-destructive')} />
    ),
    success: <CheckCircle2 className={cn(iconClassName, 'stroke-zinc-500')} />,
  }[type]

  return (
    <div
      className={cn(
        // /backdrop-blur-sm /bg-opacity-70
        'absolute z-50 flex h-full w-full flex-col items-center justify-center bg-black'
      )}
    >
      <div
        className={cn(
          'relative duration-300 animate-in fade-in zoom-in',
          'flex flex-col items-center justify-center text-center text-xl'
        )}
      >
        {Icon}
        {title && <div className="my-4 text-2xl">{title}</div>}
        {children}
      </div>
    </div>
  )
}
