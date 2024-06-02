import { cn } from '@/lib/utils'

type WindowProps = DefaultProps & {
  title: string
  children: React.ReactNode
}

export const Window = (props: WindowProps) => (
  <div className="relative isolate">
    <div className="relative mx-auto max-w-4xl rounded-lg border border-secondary-1 bg-black/80 shadow-2xl">
      <div className="relative flex select-none items-center px-2 py-4">
        {/* <WindowControlsOSX className="left-0 ml-6" /> */}
        <div className="relative mx-auto inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium">
          <DotIcon />
          <span className="bg-transparent pl-2 text-center text-primary-2 focus:border-none focus:outline-none">
            {props.title}
          </span>
        </div>
        <WindowControls className="right-0 mr-6" />
      </div>
      <div className="relative p-4">{props.children}</div>
    </div>
  </div>
)

const DotIcon = () => (
  <div>
    <svg
      className="h-1.5 w-1.5 fill-blue-500"
      viewBox="0 0 6 6"
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3"></circle>
    </svg>
  </div>
)

const WindowControlsOSX = ({ className }: DefaultProps) => (
  <div className="absolute flex items-center gap-3">
    <div className="h-3 w-3 rounded-full bg-red-500"></div>
    <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
    <div className="h-3 w-3 rounded-full bg-green-500"></div>
  </div>
)

const WindowControls = ({ className }: DefaultProps) => (
  <div
    className={cn(
      'absolute flex items-center gap-3 text-secondary-2',
      className
    )}
  >
    <Dash />
    <Box />
    <Cross />
  </div>
)

const Dash = () => (
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
    className="lucide lucide-minus h-4 w-4"
  >
    <path d="M5 12h14"></path>
  </svg>
)
const Box = () => (
  <svg
    className="h-4 w-4 stroke-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
  </svg>
)

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
