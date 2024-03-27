import fs from 'fs'
import ytdl from 'ytdl-core'

const { DATA_DIR } = process.env

export async function handleRemoteStream(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'lowest',
      filter: (format) => format.container === 'mp4',
    })
    const stream = ytdl(url, {
      format,
    })
    return stream
  } catch (e) {
    throw new Error(`Failed downloading stream from source ${url}`)
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
    throw new Error('Filed reading/writing file from client upload')
  }
}
