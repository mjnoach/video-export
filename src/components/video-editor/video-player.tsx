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

type VideoPlayerProps = React.HtmlHTMLAttributes<HTMLElement> & {
  src: string
  onPlayerChange?: (player: any) => void
  onChange?: (playerState: any) => void
  startTime?: number
}

export function VideoPlayer({
  src,
  onPlayerChange = () => {},
  onChange = () => {},
  startTime = undefined,
}: VideoPlayerProps) {
  const [player, setPlayer] = useState<PlayerReference | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)

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

  return (
    <div className={'video-player'}>
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
    </div>
  )
}
