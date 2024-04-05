import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

import { useExportRequest } from '@/lib/api'
import { cn } from '@/lib/utils'

import { Actions } from '../actions'
import { EditorActions, EditorContext } from '../context/editor'
import { Overlay } from '../overlay'
import { Progress } from '../ui/progress'
import { Slider, Sliders } from '../ui/slider'
import { ClipInfo } from './clip-info'
import { PlayerControls } from './player-controls'

import { LucideLink } from 'lucide-react'
import type { OnProgressProps } from 'react-player/base'
import ReactPlayer from 'react-player/lazy'

type VideoPlayerProps = DefaultProps & {}

export function VideoPlayer({}: VideoPlayerProps) {
  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isLoadingPlayer, setLoadingPlayer] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValues, setSliderValues] = useState([0, 0, 0])
  const { clip, ...editor } = useContext(EditorContext)
  const exportRequest = useExportRequest()

  useEffect(() => {
    if (exportRequest.data) {
      editor.storeItem(exportRequest.data)
      setTimeout(() => {
        exportRequest.reset()
        editor.setDisabled(false)
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportRequest.isSuccess])

  useEffect(() => {
    if (hasReachedEnd()) setIsPlaying(false)
    editor.updateClip({
      start: getSlider('Start'),
      end: getSlider('End'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues])

  useEffect(() => {
    player && setSliderValues([0, 0, player.getDuration()])
    editor.setActions(actions)

    if (!clip.isClientUpload) {
      const internalPlayer = player?.getInternalPlayer()
      const title = internalPlayer?.videoTitle
      editor.updateClip({ title })
    }
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

  const hasReachedEnd = () => getSlider('Marker') >= getSlider('End')

  const togglePlaying = () => setIsPlaying(!isPlaying)

  function getSlider(key: keyof typeof Sliders) {
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

  function handleSeek(seconds: number) {}

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative aspect-video max-h-[60vh] w-full select-none rounded-md border-4 border-secondary-1">
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
        {exportRequest.data && (
          <Overlay type={'success'} title="Export complete!">
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}${exportRequest.data.url}`}
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
          onSeek={handleSeek}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onReady={handleReady}
          url={clip.url}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      {!isLoadingPlayer && player && (
        <div
          className={cn(
            'flex w-full flex-col items-center gap-10',
            editor.isDisabled ? 'disable' : ''
          )}
        >
          <div className="/flex-col relative flex h-[7.5rem] w-full justify-center md:flex-row">
            <div className="hidden md:block">
              <ClipInfo
                disabled={editor.isDisabled}
                moveSlider={moveSlider}
                getSlider={getSlider}
              />
            </div>
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
            step={1}
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
