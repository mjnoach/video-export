import { VideoLinkForm } from '@/components/video-link-form'

// TODO
// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range

// Improve: Use SSE instead of raw stream?
// Improve: Unset video buffering screen after player seek or clip export

// Todo: Run server as container
// Todo: Install ffmpeg in the container

export default function Home() {
  return (
    <main>
      <div className="mt-40">
        <VideoLinkForm />
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  )
}
