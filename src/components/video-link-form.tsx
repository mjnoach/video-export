'use client'

import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const onSubmit = (data: FormData) => {
    router.push(`/edit?videoUrl=${data.videoUrl}`)
  }

  return (
    <div className="flex flex-col text-zinc-300">
      <div
        onClick={() => setFocus('videoUrl')}
        className="group/form panel flex flex-col gap-6 px-5 py-4"
      >
        <div>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Paste & Go <Arrow className="group-hover/form:translate-x-1" />
          </h2>
          <p className={`m-0 max-w-md text-sm text-zinc-400`}>
            Paste a YouTube video link and jump into the editor!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center">
            <div className="group/input grow">
              <label
                htmlFor="videoUrl"
                className={cn('mb-2 block text-sm font-medium')}
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
                    '/border block w-full rounded-lg p-2.5 text-sm',
                    errors.videoUrl && 'border-red-500'
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(
      'inline-block h-8 w-8 stroke-zinc-300 transition-transform motion-reduce:transform-none',
      className
    )}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)
