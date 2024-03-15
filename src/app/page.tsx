import { VideoLinkForm } from '@/components/video-link-form'

// TODO
// Fix: Arrow Icon gets invisible when a long link is pasted into video link form

// Feature: Multiple slider ranges for exporting a video combined of multiple clips
// Feature: Add a cropping frame that will only capture the selected area for a given slider range

// Improve: Video processing progress state. Use backend polling to display export process progress.
// Improve: Press and hold a slider control button to quickly seek start/end sliders
// Improve: After export unset video buffering screen

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
