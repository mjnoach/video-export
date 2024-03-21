declare module 'bun' {
  interface Env {
    CERT: string
    CERT_KEY: string
    FFMPEG_PATH: string
    FFPROBE_PATH: string
  }
}
