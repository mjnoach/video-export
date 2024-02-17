import { VideoLinkForm } from '@/components/video-link-form'

// TODO
// 1. Change slider scale on scroll for precise control range selection on lengthy videos
// 2. Add video export notification dot on the drawer handle
// 3. Optional: Add additional playback ranges to clip different parts of the same video easily
// 4. Optional: Add video export progress bar
// 5. Feature: video download
// 6. Fix: video export not being added to the library
// // 7. Fix: slider labels overlaping with each other - on hover make current label z-index higher and shadow other labels
// 8. Feature: shareble link to a player respecting ranges specified in the url query

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
