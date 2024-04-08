'use client'

import { useContext } from 'react'

import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { EditorContext } from '../context/editor'

import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'

const YOUTUBE_URL_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm

type FormInputs = {
  videoUrl: string
}

export function VideoLinkForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<FormInputs>()
  const editor = useContext(EditorContext)
  const router = useRouter()

  const onSubmit = (data: FormInputs) => {
    editor.setClip({ url: data.videoUrl } as Clip)
    router.push(`/edit`)
  }

  return (
    <div
      className="group/form panel flex flex-col gap-6 px-5 py-6"
      onClick={() => setFocus('videoUrl')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex items-center">
          <div className="group/input grow">
            <label
              htmlFor="videoUrl"
              className={cn('mb-2 block text-sm font-medium')}
            >
              YouTube video link
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
                  'w-full rounded-lg border border-secondary-2 bg-transparent p-2.5 text-sm',
                  errors.videoUrl && 'border-red-500'
                )}
              />
              <button className="flex" type="submit">
                <ArrowRight className="absolute right-3 cursor-pointer select-none self-center transition-transform group-hover/input:translate-x-1 motion-reduce:transform-none" />
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
  )
}
