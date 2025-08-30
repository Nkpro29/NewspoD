"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export type AudioPlayerProps = {
  src: string
  className?: string
  // Optional preset duration if you already know it; will be replaced once metadata loads
  presetDuration?: number | null
}

export function AudioPlayer({ src, className, presetDuration = null }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState<number>(presetDuration ?? 0)
  const [isSeeking, setIsSeeking] = React.useState(false)

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
    }
    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
    }
  }, [isSeeking])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (e) {
        // Autoplay might be blocked
        console.error(e)
      }
    }
  }

  const onSeek = (val: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const target = val[0] ?? 0
    setCurrentTime(target)
  }

  const onSeekStart = () => setIsSeeking(true)
  const onSeekEnd = (val: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const target = val[0] ?? 0
    audio.currentTime = target
    setCurrentTime(target)
    setIsSeeking(false)
  }

  return (
    <div className={className}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" variant="secondary" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 0}
            step={1}
            onValueChange={onSeek}
            onPointerDown={onSeekStart}
            onValueCommit={onSeekEnd}
            aria-label="Seek"
          />
        </div>
        <div className="w-20 text-right text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
      </div>
    </div>
  )
}