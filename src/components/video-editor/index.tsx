'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { sliderValueToVideoTime } from '@/lib/utils'

import { VideoConversionButton } from './video-conversion-button'
import { VideoPlayer } from './video-player'
import { VideoUpload } from './video-upload'

import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { Slider, Spin } from 'antd'

const ffmpeg = createFFmpeg({ log: true })

type VideoPlayerType = {
  seek: (time: number) => void
}

type VideoPlayerStateType = {
  duration: number
  currentTime: number
}

type VideoFileType = File

type VideoEditorProps = {
  videoFile?: any
}

export function VideoEditor(props: VideoEditorProps) {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
  const [videoFile, setVideoFile] = useState<VideoFileType | null>(
    props.videoFile ?? null
  )
  console.log('🚀 ~ VideoEditor ~ videoFile:', videoFile)
  const [videoPlayerState, setVideoPlayerState] = useState<
    VideoPlayerStateType | undefined
  >()
  const [videoPlayer, setVideoPlayer] = useState<VideoPlayerType | undefined>()
  const [gifUrl, setGifUrl] = useState<string | undefined>()
  const [sliderValues, setSliderValues] = useState([0, 100])
  const [processing, setProcessing] = useState(false)

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
  }, [sliderValues, videoPlayer, videoPlayerState])

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
  }, [videoPlayerState, sliderValues, videoPlayer])

  useEffect(() => {
    // when the current videoFile is removed,
    // restoring the default state
    if (!videoFile) {
      setVideoPlayerState(undefined)
      setSliderValues([0, 100])
      setVideoPlayerState(undefined)
      setGifUrl(undefined)
    }
  }, [videoFile])

  return (
    <div>
      <Spin
        spinning={processing || !ffmpegLoaded}
        tip={!ffmpegLoaded ? 'Waiting for FFmpeg to load...' : 'Processing...'}
      >
        <div>
          {videoFile ? (
            <VideoPlayer
              src={URL.createObjectURL(videoFile)}
              onPlayerChange={(videoPlayer) => {
                setVideoPlayer(videoPlayer)
              }}
              onChange={(videoPlayerState) => {
                setVideoPlayerState(videoPlayerState)
              }}
            />
          ) : (
            <>
              <h1>Upload a video</h1>
              <div>
                <VideoUpload
                  disabled={!!videoFile}
                  onChange={(videoFile) => {
                    setVideoFile(videoFile)
                  }}
                  onRemove={() => {
                    setVideoFile(null)
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <h3>Cut Video</h3>
          <Slider
            className="dark:invert"
            disabled={!videoPlayerState}
            value={sliderValues}
            range={true}
            onChange={(values) => {
              setSliderValues(values)
            }}
            tooltip={{
              formatter: null,
            }}
          />
        </div>

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
            videoFile={videoFile}
            onGifCreated={(girUrl) => {
              setGifUrl(girUrl)
            }}
          />
        </div>
        {gifUrl && (
          <div className={'gif-div'}>
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
      </Spin>
    </div>
  )
}
