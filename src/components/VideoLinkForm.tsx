'use client'

import { cn } from '@/lib/utils'

import { useForm } from 'react-hook-form'

const YOUTUBE_URL_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm

type FormData = {
  videoUrl: string
}

export function VideoLinkForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log('🚀 ~ VideoLinkForm ~ data:', data)
  }

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setFocus('videoUrl')}
        className="group/form flex flex-col gap-6 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      >
        <div>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Paste & Go <Arrow className="group-hover/form:translate-x-1" />
          </h2>
          <p className={`m-0 max-w-md text-sm opacity-50`}>
            Paste a YouTube video link and jump into the editor!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center">
            <div className="group/input grow">
              <label
                htmlFor="videoUrl"
                className={cn(
                  'mb-2 block text-sm font-medium',
                  errors.videoUrl && 'text-red-700 dark:text-red-500'
                )}
              >
                Video link
              </label>
              <div className="relative flex">
                <input
                  {...register('videoUrl', {
                    required: 'Video link is required',
                    pattern: {
                      value: YOUTUBE_URL_REGEX,
                      message: 'Invalid video link',
                    },
                  })}
                  aria-invalid={errors.videoUrl ? 'true' : 'false'}
                  type="url"
                  id="videoUrl"
                  className={cn(
                    'block w-full rounded-lg border p-2.5 text-sm dark:bg-gray-700',
                    errors.videoUrl &&
                      'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500'
                  )}
                  placeholder="YouTube video link"
                />
                <button className="flex" type="submit">
                  <Arrow className="absolute right-6 cursor-pointer select-none self-center group-hover/input:translate-x-1" />
                </button>
              </div>
              {errors.videoUrl && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* <div className="mb-6">
            <label
              htmlFor="success"
              className="mb-2 block text-sm font-medium text-green-700 dark:text-green-500"
            >
              Your name
            </label>
            <input
              type="text"
              id="success"
              className="block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-500 dark:bg-gray-700 dark:text-green-400 dark:placeholder-green-500"
              placeholder="Success input"
            />
            <p className="mt-2 text-sm text-green-600 dark:text-green-500">
              <span className="font-medium">Well done!</span> Some success
              message.
            </p>
          </div> */}
        </form>
      </div>
    </div>
  )
}

const Arrow = ({ className }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(
      'inline-block h-8 w-8 transition-transform motion-reduce:transform-none',
      className
    )}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)
