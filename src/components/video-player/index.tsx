import { createRef, useContext, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { EditorContext } from '../context/editor'
import { Loading } from '../loading'
import { Slider, Sliders } from '../ui/slider'
import { Controls } from './controls'

import { FFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import ReactPlayer from 'react-player'

type VideoPlayerProps = DefaultProps & {
  video: Video
  ffmpeg: FFmpeg
}

export function VideoPlayer({ video, ffmpeg }: VideoPlayerProps) {
  const playerRef = createRef<ReactPlayer>()
  const sliderRef = createRef<HTMLDivElement>()

  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const duration = player?.getDuration() ?? 0
  const [isPlaying, setIsPlaying] = useState(false)
  const src = (
    video.obj ? URL.createObjectURL(video.obj) : video.path
  ) as string
  const [sliderValues, setSliderValues] = useState([0, 0, 0])

  const { actions, setActions, disabled, setDisabled, storeVideo } =
    useContext(EditorContext)

  useEffect(() => {
    if (hasReachedEnd()) {
      setIsPlaying(false)
    }

    setActions({
      previewVideo: () => {
        setSlider('Marker', getSlider('Start'))
        player?.seekTo(getSlider('Start'))
        setIsPlaying(true)
      },

      exportVideo: async () => {
        console.log('🚀 ~ exportVideo: ~ exportVideo:')

        setIsPlaying(false)
        setDisabled(true)

        const inputFileName = 'inputFileName.mp4'
        const outputFileName = 'output.mp4'

        ffmpeg.FS('writeFile', inputFileName, await fetchFile(src))
        await ffmpeg.run(
          '-i',
          inputFileName,
          '-ss',
          `${getSlider('Start')}`,
          '-to',
          `${getSlider('End')}`,
          '-f',
          'mp4',
          outputFileName
        )

        const data = ffmpeg.FS('readFile', outputFileName)
        const dataUrl = URL.createObjectURL(
          new Blob([data.buffer], { type: 'video/mp4' })
        )

        console.log('🚀 ~ exportVideo: ~ dataUrl:', dataUrl)

        await storeVideo({
          url: dataUrl,
        })

        setDisabled(false)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, sliderValues])

  useEffect(() => {
    setSliderValues([0, duration / 2, duration])
  }, [duration])

  const hasReachedEnd = () => getSlider('Marker') >= getSlider('End')

  const togglePlaying = () => {
    if (hasReachedEnd()) setSlider('Marker', getSlider('Start'))
    setIsPlaying(!isPlaying)
  }

  const getSlider = (key: keyof typeof Sliders) => sliderValues[Sliders[key]]

  const setSlider = (key: keyof typeof Sliders, value: number) =>
    setSliderValues((prev) => {
      const sliders = [...prev]
      sliders[Sliders[key]] = value
      return sliders
    })

  function determineActiveSlider(values: number[]) {
    const activeSlider = values.findIndex((v, i) => v !== sliderValues[i])
    return activeSlider
  }

  function handleSliderChange(values: number[]) {
    setSliderValues(values)
    const sliderId = determineActiveSlider(values)
    if (isPlaying && sliderId !== Sliders.Marker) return
    player?.seekTo(values[sliderId])
  }

  function handleSkipTo(value: number) {
    player?.seekTo(value)
    setSlider('Marker', value)
  }

  function handlePlay() {
    player?.seekTo(getSlider('Marker'))
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    if (isPlaying) setSlider('Marker', playedSeconds)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={togglePlaying}
        className={cn(
          disabled ? 'pointer-events-none' : '',
          'relative aspect-video overflow-clip rounded-md',
          player !== null ? 'border-2 border-brand' : ''
        )}
      >
        {disabled && (
          <Loading>
            <h1 className="text-xl">Processing video export...</h1>
          </Loading>
        )}
        <ReactPlayer
          onProgress={handleProgress}
          onPlay={handlePlay}
          ref={playerRef}
          onReady={(player) => setPlayer(player)}
          className="react-player"
          url={src}
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-10">
        {player && (
          <>
            <Controls
              disabled={disabled}
              player={player}
              handleSkipTo={handleSkipTo}
              getSlider={getSlider}
              togglePlaying={togglePlaying}
              isPlaying={isPlaying}
            />
            <Slider
              ref={sliderRef}
              max={duration}
              step={1}
              disabled={disabled}
              value={sliderValues}
              sliderValues={sliderValues}
              minStepsBetweenThumbs={1}
              onValueChange={handleSliderChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
