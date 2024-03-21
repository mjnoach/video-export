declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      CERT: string
      CERT_KEY: string
      FFMPEG_PATH: string
      FFPROBE_PATH: string
    }
  }
}

export {}
