import { parseSeconds } from './utils'

import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'

ffmpeg.setFfmpegPath('/Users/andrzej/ffmpeg/bin/ffmpeg')
ffmpeg.setFfprobePath('/Users/andrzej/ffmpeg/bin/ffprobe')

type ProgressData = {
  frames: number
  currentFps: number
  currentKbps: number
  targetSize: number
  timemark: string
}

export async function transcodeVideoStream(
  source: string | Readable,
  target: {
    path: string
    start: number
    end: number
    format: string
  }
) {
  const { path, start, end, format } = target
  const duration = end - start
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(source)
      .setDuration(duration)
      .output(path)
      .seekOutput(start)
      .format(format)
      .on('start', () => {
        console.log('Transcoding started!')
      })
      .on('progress', (progress: ProgressData) => {
        const percent = (
          (parseSeconds(progress.timemark) / duration) *
          100
        ).toFixed(0)
        console.log(`Processing: ${percent}%`)
      })
      .on('end', () => {
        console.log('Transcoding complete!', target.path)
        resolve(true)
      })
      .on('error', (err) => {
        console.error(err)
        reject(err)
      })
      .run()
  })
}
