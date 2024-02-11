import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { PlayerReference, PlayerState } from 'video-react'
import 'video-react/dist/video-react.css'

type VideoPlayerProps = DefaultProps & {
  media: MediaType | null // MediaStream
  src: string
  onPlayerChange?: (player: any) => void
  onChange?: (playerState: any) => void
  startTime?: number
}

export function VideoPlayer({
  media,
  src,
  onPlayerChange = () => {},
  onChange = () => {},
  startTime = undefined,
}: VideoPlayerProps) {
  const [player, setPlayer] = useState<PlayerReference | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)
  const [filePath, setFilePath] = useState<string>('')

  useEffect(() => {
    if (playerState) {
      onChange(playerState)
    }
  }, [onChange, playerState])

  useEffect(() => {
    onPlayerChange(player)

    if (player) {
      player.subscribeToStateChange(setPlayerState)
    }
  }, [onPlayerChange, player])

  const searchParams = useSearchParams()
  const videoUrl = searchParams.get('videoUrl') ?? ''

  useEffect(() => {
    load()
    async function load() {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/edit/api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl }),
        }
      )
      const data = await res.json()
      console.log('🚀 ~ load ~ data:', data)
      setFilePath(data.fileName)
    }
  }, [videoUrl])

  return (
    <>
      <video className="aspect-video w-full" src={filePath} autoPlay controls />
      {/* <Player
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
      </Player> */}
    </>
  )
}
