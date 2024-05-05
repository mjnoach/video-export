import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useExportRequest } from '@/lib/api'
import { cn } from '@/lib/utils'

import { EditorActions, EditorContext } from '../../context/editor'
import { Actions } from '../actions'
import { Overlay } from '../overlay'
import { Progress } from '../ui/progress'
import { Slider, Sliders } from '../ui/slider'
import { ClipInfo } from './clip-info'
import { PlayerControls } from './player-controls'

import { LucideLink } from 'lucide-react'
import type { OnProgressProps } from 'react-player/base'
import ReactPlayer from 'react-player/lazy'

export function VideoPlayer() {
  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isLoadingPlayer, setLoadingPlayer] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const editor = useContext(EditorContext)
  const [sliderValues, setSliderValues] = useState([
    editor.clip.start ?? 0,
    editor.clip.start ?? 0,
    editor.clip.duration ?? 0,
  ])
  const exportRequest = useExportRequest()
  const router = useRouter()

  useEffect(() => {
    if (!editor.clip.url) router.replace('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    if (hasReachedEnd()) setIsPlaying(false)
    editor.updateClip({
      start: getSlider('Start'),
      duration: getSlider('End') - getSlider('Start'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues])

  useEffect(() => {
    const clip = editor.clip
    if (player && clip.duration === 0) {
      setSlider('End', player.getDuration())
    }
    if (!clip.isClientUpload) {
      const internalPlayer = player?.getInternalPlayer()
      const title = internalPlayer?.videoTitle
      editor.updateClip({ title })
    }
    editor.setActions(actions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  const actions: EditorActions = {
    previewClip: (clip: Clip) => {
      setSlider('Marker', clip.start)
      player?.seekTo(clip.start)
      setIsPlaying(true)
    },
    exportClip: async (clip: Clip) => {
      setSlider('Marker', clip.start)
      player?.seekTo(clip.start)
      editor.setDisabled(true)
      setIsPlaying(false)
      exportRequest.mutate(clip)
    },
  }

  function handleExportComplete() {
    if (exportRequest.data) {
      editor.storeExport(exportRequest.data)
      exportRequest.reset()
      editor.setDisabled(false)
    }
  }

  const hasReachedEnd = () => getSlider('Marker') >= getSlider('End')

  const togglePlaying = () => setIsPlaying(!isPlaying)

  const getSlider = (key: keyof typeof Sliders) => {
    return sliderValues[Sliders[key]]
  }

  const setSlider = (key: keyof typeof Sliders, value: number) =>
    setSliderValues((prev) => {
      const sliders = [...prev]
      sliders[Sliders[key]] = value
      return sliders
    })

  const getUpdatedSliderId = (values: number[]) =>
    sliderValues.findIndex((v, i) => v !== values[i])

  function handleSliderChange(values: number[]) {
    setSliderValues(values)
    const sliderId = getUpdatedSliderId(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    player?.seekTo(values[sliderId])
  }

  function handleSliderCommit(values: number[]) {
    setSliderValues(values)
    const sliderId = getUpdatedSliderId(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    if (!isPlaying && sliderId !== Sliders.Marker)
      return player?.seekTo(getSlider('Marker'))
    player?.seekTo(values[sliderId])
  }

  function handleSkipTo(value: number) {
    const start = getSlider('Start')
    const end = getSlider('End')
    if (value < start) value = start
    if (value > end) value = end
    player?.seekTo(value)
    setSlider('Marker', value)
  }

  function moveSlider(step: number, sliderKey: keyof typeof Sliders) {
    if (!player) return
    setSliderValues((prev) => {
      const duration = player.getDuration()
      const sliders = [...prev]
      const value = sliders[Sliders[sliderKey]] + step
      if (value < 0 || value > duration) return sliders
      sliders[Sliders[sliderKey]] = value
      player?.seekTo(value)
      return sliders
    })
  }

  function handleProgress(progress: OnProgressProps) {
    if (isPlaying) setSlider('Marker', progress.playedSeconds)
  }

  function handleReady(player: ReactPlayer) {
    setPlayer(player)
    setLoadingPlayer(false)
  }

  function handlePlay() {
    if (hasReachedEnd()) {
      setSlider('Marker', getSlider('Start'))
      player?.seekTo(getSlider('Start'))
    }
    !isPlaying && togglePlaying()
  }

  function handlePause() {
    isPlaying && togglePlaying()
  }

  function handleError(
    error: any,
    data?: any,
    hlsInstance?: any,
    hlsGlobal?: any
  ) {
    console.error('Player Error')
    console.error(error)
  }

  const responseOverlay =
    exportRequest.isPending || exportRequest.warning || exportRequest.data

  function handleVideoFrameClick() {
    if (!editor.clip.isClientUpload || responseOverlay) return
    togglePlaying()
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        onClick={handleVideoFrameClick}
        className="relative aspect-video max-h-[60vh] w-full select-none rounded-md border-4 border-secondary-1"
      >
        {exportRequest.isPending && (
          <Overlay type={'loading'} title="Processing...">
            {(() => {
              const { progress } = exportRequest
              if (progress === null) return 'Initializing'
              if (progress === 100) return 'Finalizing'
              return `${progress}%`
            })()}
            <Progress
              value={exportRequest.progress}
              className="absolute -bottom-8 h-1 w-[200%]"
            />
          </Overlay>
        )}
        {exportRequest.error && (
          <Overlay
            type={'error'}
            title={exportRequest.error?.name || 'Error'}
            onDismiss={() => {
              exportRequest.reset()
              editor.setDisabled(false)
            }}
          >
            <div className="px-10">{exportRequest.error?.message}</div>
          </Overlay>
        )}
        {exportRequest.warning && (
          <Overlay
            type={'warning'}
            timeout={3000}
            onDismiss={() => {
              exportRequest.reset()
              editor.setDisabled(false)
            }}
          >
            <div className="px-10">{exportRequest.warning}</div>
          </Overlay>
        )}
        {exportRequest.data && (
          <Overlay
            type={'success'}
            title="Export complete!"
            timeout={5000}
            onDismiss={() => {
              handleExportComplete()
            }}
          >
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/${exportRequest.data.url}`}
              className="flex gap-2 px-10"
              target="_blank"
            >
              <LucideLink className="w-5 text-primary-2" />
              {`${exportRequest.data.id}.${exportRequest.data.format}`}
            </Link>
          </Overlay>
        )}
        {isLoadingPlayer && <Overlay type={'loading'}></Overlay>}
        <ReactPlayer
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                controls: 0,
                rel: 0,
                autoplay: Number(isPlaying),
              },
            },
          }}
          progressInterval={100}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onReady={handleReady}
          url={editor.clip.url}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      {!isLoadingPlayer && player && (
        <div
          className={cn(
            'flex w-full flex-col items-center gap-10 px-2',
            editor.isDisabled ? 'disable' : ''
          )}
        >
          <div className="relative flex h-[7.5rem] w-full justify-center sm:flex-row">
            <ClipInfo
              videoDuration={player.getDuration()}
              disabled={editor.isDisabled}
              moveSlider={moveSlider}
              getSlider={getSlider}
            />
            <PlayerControls
              disabled={editor.isDisabled}
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
          </div>
          <Slider
            disabled={editor.isDisabled}
            max={player.getDuration()}
            step={0.1}
            value={sliderValues}
            sliderValues={sliderValues}
            minStepsBetweenThumbs={0}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
          />
          <Actions />
        </div>
      )}
    </div>
  )
}
