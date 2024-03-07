import { VideoLinkForm } from '@/components/video-link-form'

// TODO
// 3. Add additional playback ranges to clip different parts of the same video easily
// 4. Add video export progress bar
// 5. Feature: download clip
// 8. Feature: shareble link to a player respecting ranges specified in the url query
// 11. add export type: video clip, audio clip, gif

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
