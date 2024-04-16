import { SourceException } from './exceptions.js'

import fs from 'fs'
import ytdl from 'ytdl-core'

const { DATA_DIR } = process.env

export async function handleRemoteSource(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    // console.log(
    //   '🚀 ~ handleRemoteSource ~ info.formats:',
    //   info.formats.map((f) => ({
    //     // 1: f.mimeType,
    //     quality: f.quality,
    //     qualityLabel: f.qualityLabel,
    //     width: f.width,
    //     height: f.height,
    //     container: f.container,
    //   }))
    // )
    const format = ytdl.chooseFormat(info.formats, {
      // TODO
      // remove this limitation after server resouces have been increased
      quality: 'lowest',
      filter: (format) =>
        format.container === 'webm' && format.qualityLabel === '480p',
    })
    // console.log('🚀 ~ handleRemoteSource ~ format:', format)
    const stream = ytdl(url, {
      format,
    })
    return stream
  } catch (e: any) {
    throw new SourceException(`Failed downloading stream from source ${url}`, e)
  }
}

export async function handleClientSource(file: File, targetClip: ExportTarget) {
  // TODO
  // try streaming data without writing tmep file
  try {
    const path = `${DATA_DIR}/${targetClip.id}.mp4`
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    await fs.promises.writeFile(path, fileBuffer)
    return path
  } catch (e: any) {
    throw new SourceException(
      'Filed reading/writing file from client upload',
      e
    )
  }
}
