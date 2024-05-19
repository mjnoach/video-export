import ytdl from 'ytdl-core'

export async function downloadRemoteStream(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    // printFormatsInfo(info)
    const format = ytdl.chooseFormat(info.formats, {
      // remove quality limitations after server resouces have been increased
      filter: (f) =>
        ['webm', 'mp4'].includes(f.container) &&
        f.qualityLabel === '360p' &&
        f.hasAudio,
    })
    return ytdl(url, {
      format,
    }).on('progress', (_current, downloaded, total) => {
      const fraction = downloaded / total
      const percent = (fraction * 100).toFixed(0)
      // console.log('🚀 ~ downloadRemoteSource ~ percent:', percent)
    })
  } catch (e: any) {
    throw new Error(`Failed downloading stream from source ${url}`, e)
  }
}

export async function parseToFormData(clip: Clip) {
  const formData = new FormData()
  formData.append('clip', JSON.stringify(clip))
  const blob = await (await fetch(clip.url)).blob()
  formData.append(
    'file',
    new File([blob], clip.title, {
      type: 'video/mp4',
    })
  )
  return formData
}
