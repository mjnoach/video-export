import { useEffect, useState } from 'react'

import {
  BigPlayButton,
  ControlBar,
  LoadingSpinner,
  PlayToggle,
  Player,
  PlayerReference,
  PlayerState,
} from 'video-react'
import 'video-react/dist/video-react.css'

type VideoPlayerProps = DefaultProps & {
  video: Video
  onPlayerChange?: (player: PlayerReference) => void
  onStateChange?: (playerState: any) => void
  startTime?: number
}

export function VideoPlayer({
  video,
  onPlayerChange = () => {},
  onStateChange = () => {},
  startTime = undefined,
}: VideoPlayerProps) {
  // console.log('🚀 ~ video:', video)

  const [player, setPlayer] = useState<PlayerReference | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)

  // useEffect(() => {
  //   load()
  //   async function load() {
  //     const res: Response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/edit/api`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ videoUrl }),
  //       }
  //     )
  //     const data = await res.json()
  //     console.log('🚀 ~ load ~ data:', data)
  //     setFilePath(data.fileName)
  //   }
  // }, [videoUrl])

  useEffect(() => {
    if (playerState) {
      onStateChange(playerState)
    }
  }, [playerState])

  useEffect(() => {
    if (player) {
      onPlayerChange(player)
      player.subscribeToStateChange(setPlayerState)
    }
  }, [player])

  const src = video.obj ? URL.createObjectURL(video.obj) : video.path
  // console.log('🚀 ~ src:', src)

  return (
    <>
      {/* <video className="aspect-video w-full" src={src} autoPlay controls /> */}
      <Player
        ref={(player) => {
          setPlayer(player)
        }}
        startTime={startTime}
      >
        <source src={src} />
        <BigPlayButton position="center" />
        <LoadingSpinner />
        <ControlBar autoHide={false} disableDefaultControls={true}>
          <PlayToggle />
        </ControlBar>
      </Player>
    </>
  )
}
