'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { sliderValueToVideoTime } from '@/lib/utils'

import { Slider } from '../ui/slider'
import { VideoConversionButton } from './video-conversion-button'
import { VideoPlayer } from './video-player'
import { VideoUpload } from './video-upload'

import loading from '@/../public/loading.gif'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { PlayerReference, PlayerState } from 'video-react'

const ffmpeg = createFFmpeg({ log: true })

type VideoEditorProps = {
  video?: any
}

export function VideoEditor(props: VideoEditorProps) {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
  const [video, setVideo] = useState<Video | null>(props.video ?? null)
  const [videoPlayerState, setVideoPlayerState] = useState<PlayerState | null>()
  const [videoPlayer, setVideoPlayer] = useState<PlayerReference | null>()
  const [gifUrl, setGifUrl] = useState<string | undefined>()
  const [sliderValues, setSliderValues] = useState([0, 100])
  const [processing, setProcessing] = useState(false)

  const isLoading = !ffmpegLoaded || processing

  useEffect(() => {
    // loading ffmpeg on startup
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load().then(() => {
        setFFmpegLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    const min = sliderValues[0]
    // when the slider values are updated, updating the
    // video time
    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min))
    }
  }, [sliderValues])

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      // allowing users to watch only the portion of
      // the video selected by the slider
      const [min, max] = sliderValues

      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min)
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max)

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime)
      }
      if (videoPlayerState.currentTime > maxTime) {
        // looping logic
        videoPlayer.seek(minTime)
      }
    }
  }, [videoPlayerState])

  useEffect(() => {
    console.log('🚀 ~ VideoEditor ~ video:', video)
    // when the current video is removed,
    // restoring the default state
    if (!video) {
      setVideoPlayerState(null)
      setSliderValues([0, 100])
      setVideoPlayerState(null)
      setGifUrl(undefined)
    }
  }, [video])

  return (
    <div className="flex h-full flex-col">
      <div className="flex grow flex-col justify-between">
        <div className="flex aspect-video grow flex-col items-center justify-center bg-gray-950">
          {/* <LoadingCard /> */}
          {isLoading ? (
            <Image src={loading} alt="loading" className="h-16 w-16" />
          ) : !video ? (
            <VideoUpload
              disabled={!!video}
              setVideo={(video: Video) => {
                setVideo(video)
              }}
            />
          ) : (
            <VideoPlayer
              video={video}
              onPlayerChange={(videoPlayer: PlayerReference) => {
                setVideoPlayer(videoPlayer)
              }}
              onStateChange={(videoPlayerState) => {
                setVideoPlayerState(videoPlayerState)
              }}
            />
          )}
        </div>

        <div className="mt-10 flex flex-col items-start gap-10">
          <Slider
            max={100}
            step={1}
            disabled={!videoPlayerState}
            value={sliderValues}
            onValueChange={(values) => {
              setSliderValues(values)
            }}
          />
          <div className="flex flex-col gap-8">
            <div className={'dark:invert'}>
              <VideoConversionButton
                onConversionStart={() => {
                  setProcessing(true)
                }}
                onConversionEnd={() => {
                  setProcessing(false)
                }}
                ffmpeg={ffmpeg}
                videoPlayerState={videoPlayerState}
                sliderValues={sliderValues}
                video={video}
                onGifCreated={(girUrl) => {
                  setGifUrl(girUrl)
                }}
              />
            </div>
            {gifUrl && (
              <div>
                <h3>Resulting GIF</h3>
                <Image
                  src={gifUrl}
                  className={'gif'}
                  alt={'GIF file generated in the client side'}
                />
                <a
                  href={gifUrl}
                  download={'test.gif'}
                  className={'ant-btn ant-btn-default'}
                >
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingCard = () => (
  <div className="flex h-full flex-col">
    <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4 shadow">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-slate-700"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-slate-700"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-slate-700"></div>
              <div className="col-span-1 h-2 rounded bg-slate-700"></div>
            </div>
            <div className="h-2 rounded bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
