import { cn } from '@/lib/utils'

import { Button } from './ui/button'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

type OverlayPropps = DefaultProps & {
  type: 'loading' | 'error' | 'success'
  isOpen?: boolean
  onDismiss?: () => void
  title?: string
}

export const Overlay = ({
  children,
  type,
  isOpen,
  title,
  onDismiss,
}: OverlayPropps) => {
  const Icon = {
    loading: <Loader2 className={'overlay-icon animate-spin'} />,
    error: <AlertTriangle className={'overlay-icon text-destructive'} />,
    success: (
      <CheckCircle2 className={'overlay-icon /text-success text-primary-2'} />
    ),
  }[type]

  return (
    <div
      className={cn(
        // /backdrop-blur-sm /bg-opacity-70
        'absolute z-10 flex h-full w-full flex-col items-center justify-center bg-black'
      )}
    >
      <div
        className={cn(
          'relative select-text duration-300 animate-in fade-in zoom-in',
          'flex flex-col items-center justify-center text-center text-xl'
        )}
      >
        {Icon}
        {title && <div className="my-4 text-2xl">{title}</div>}
        {children}
      </div>
      {onDismiss && (
        <Button
          className="action action-destructive absolute right-8 top-8 aspect-square h-8 p-0 "
          onClick={onDismiss}
        >
          <Cross />
        </Button>
      )}
    </div>
  )
}

const Cross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-x h-4 w-4"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
)
