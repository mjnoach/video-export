import { sliderValueToVideoTime } from '@/lib/utils'

import { fetchFile } from '@ffmpeg/ffmpeg'
import { Button } from 'antd'

type VideoConversionButtonProps = React.HtmlHTMLAttributes<HTMLElement> & {
  videoPlayerState: any
  sliderValues: number[]
  videoFile: any
  ffmpeg: any
  onConversionStart?: (processing: boolean) => void
  onConversionEnd?: (processing: boolean) => void
  onGifCreated?: (gifUrl: any) => void
}

export function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
  onGifCreated = (girUrl: any) => {},
}: VideoConversionButtonProps) {
  const convertToGif = async () => {
    // starting the conversion process
    onConversionStart(true)

    const inputFileName = 'gif.mp4'
    const outputFileName = 'output.gif'

    // writing the video file to memory
    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile))

    const [min, max] = sliderValues
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min)
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max)

    // cutting the video and converting it to GIF with an FFMpeg command
    await ffmpeg.run(
      '-i',
      inputFileName,
      '-ss',
      `${minTime}`,
      '-to',
      `${maxTime}`,
      '-f',
      'gif',
      outputFileName
    )

    // reading the resulting file
    const data = ffmpeg.FS('readFile', outputFileName)

    // converting the GIF file created by FFmpeg to a valid image URL
    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    )
    onGifCreated(gifUrl)

    // ending the conversion process
    onConversionEnd(false)
  }

  return <Button onClick={() => convertToGif()}>Convert to GIF</Button>
}
