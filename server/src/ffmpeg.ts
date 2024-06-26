import { TranscodingException } from './exceptions.js'
import { getProgressPercent } from './utils.js'

import ffmpeg from 'fluent-ffmpeg'
import type { Readable } from 'stream'

const { FFMPEG_PATH, FFPROBE_PATH } = process.env

ffmpeg.setFfmpegPath(`${FFMPEG_PATH}`)
ffmpeg.setFfprobePath(`${FFPROBE_PATH}`)

export type Transcoding = {
  source: string | Readable
  target: ExportTarget & { start: number }
}

export async function transcodeVideo(
  { source, target }: Transcoding,
  port: MessagePort
) {
  let { id, path, start, duration, format } = target
  if (path.startsWith('/')) path = path.substring(1)
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(source)
      .setDuration(duration)
      .output(path)
      .seekOutput(start)
      .format(format)
      .on('start', () => {
        console.info(`Transcoding ${id} started...`)
      })
      .on('progress', (progress: ProgressData) => {
        const percent = getProgressPercent(progress, start, duration)
        port.postMessage(percent)
      })
      .on('end', () => {
        console.info(`Transcoding ${id} complete!`)
        console.info(`-> /${path}`)
        resolve()
      })
      .on('error', (err) => {
        reject(new TranscodingException(id, err))
      })
      .run()
  })
}

export async function generateThumbnail(objPath: string, objId: string) {
  const folder = objPath.split('/').slice(0, -1).join('/')
  const extension = '.png'
  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(objPath)
      .on('filenames', (filenames) => {
        console.info(`Generating thumbnail for ${objPath}`)
      })
      .on('end', () => {
        console.info('Thumbnail generated!')
        const path = `${folder}/${objId}${extension}`
        const url = `/${objId}${extension}`
        resolve(url)
      })
      .on('error', (err) => {
        console.error(err)
        reject(err)
      })
      .thumbnail({
        folder,
        filename: `${objId}${extension}`,
        timestamps: ['50%'],
        size: '427x240',
      })
  })
}
