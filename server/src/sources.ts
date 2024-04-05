import { SourceException } from './exceptions.js'

import fs from 'fs'
import ytdl from 'ytdl-core'

const { DATA_DIR } = process.env

export async function handleRemoteStream(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    // console.log(
    //   '🚀 ~ handleRemoteStream ~ info.formats:',
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
      // quality: 'highest',
      filter: (format) => format.container === 'mp4',
    })
    // console.log('🚀 ~ handleRemoteStream ~ format:', format)
    const stream = ytdl(url, {
      format,
    })
    return stream
  } catch (e) {
    throw new SourceException(`Failed downloading stream from source ${url}`)
  }
}

export async function handleClientUpload(file: File, targetClip: ExportTarget) {
  try {
    let path = `${DATA_DIR}/${targetClip.id}.mp4`
    if (path.startsWith('/')) path = path.substring(1)
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    await fs.promises.writeFile(path, fileBuffer)
    return path
  } catch (e) {
    throw new SourceException('Filed reading/writing file from client upload')
  }
}
