import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
} from 'lucide-react'

const Icon = {
  loading: <Loader2 className={'overlay-icon animate-spin'} />,
  error: <AlertTriangle className={'overlay-icon text-destructive'} />,
  success: <CheckCircle2 className={'overlay-icon text-primary-2'} />,
  warning: <AlertCircle className={'overlay-icon text-primary-2'} />,
}

type OverlayPropps = DefaultProps & {
  type: keyof typeof Icon
  isOpen?: boolean
  title?: string
  onDismiss?: () => void
  timeout?: number
}

export const Overlay = ({
  children,
  type,
  isOpen,
  title,
  onDismiss,
  timeout,
}: OverlayPropps) => {
  const [animation, setAnimation] = useState('animate-in fade-in zoom-in')

  useEffect(() => {
    if (timeout) {
      setTimeout(() => {
        setAnimation('animate-out fade-out zoom-out')
      }, timeout - 300)
      onDismiss &&
        setTimeout(() => {
          onDismiss()
        }, timeout)
    }
  }, [timeout, onDismiss])

  return (
    <div className="absolute z-10 h-full w-full bg-black">
      <div className={cn('center h-full text-xl', 'duration-300', animation)}>
        <div className="center w-full">
          {Icon[type]}
          {title && <div className="mt-4 text-2xl">{title}</div>}
          <div className="center absolute inset-y-2/3 mt-8 w-full max-w-[70%] text-center">
            {children}
          </div>
        </div>
      </div>

      {!timeout && onDismiss && (
        <Button
          className="action action-destructive absolute right-8 top-8 aspect-square h-8 p-0 "
          onClick={onDismiss}
        >
          <Plus className="rotate-45" />
        </Button>
      )}
    </div>
  )
}
