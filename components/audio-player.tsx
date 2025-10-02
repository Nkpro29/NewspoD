"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type AudioPlayerProps = {
  src: string;
  className?: string;
  // Optional preset duration if you already know it; will be replaced once metadata loads
  presetDuration?: number | null;
};

export function AudioPlayer({
  src,
  className,
  presetDuration = null,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState<number>(presetDuration ?? 0);
  const [isSeeking, setIsSeeking] = React.useState(false);

  // Use a ref to avoid re-attaching listeners when isSeeking toggles (prevents stale closures)
  const isSeekingRef = React.useRef(false);
  React.useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  // If presetDuration changes from parent, reflect it
  React.useEffect(() => {
    if (presetDuration != null && Number.isFinite(presetDuration)) {
      setDuration(presetDuration);
    }
  }, [presetDuration]);

  // Reset state & force audio to load when src changes
  React.useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsSeeking(false);
    isSeekingRef.current = false;
    setDuration(presetDuration ?? 0);

    const audio = audioRef.current;
    if (audio) {
      // Pause + reset + load new metadata
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_e) {}
      // ensure the element attempts to (re)load metadata for the new src
      try {
        audio.load();
      } catch (_e) {}
    }
  }, [src, presetDuration]);

  // Attach audio listeners. Depend on src so new listeners are created for new source.
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let pollTimer: number | null = null;

    const updateDurationIfAvailable = (): boolean => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) {
        // Only update if changed to avoid extra renders
        setDuration((prev) => (prev !== d ? d : prev));
        return true;
      }
      return false;
    };

    const onLoadedMetadata = () => {
      updateDurationIfAvailable();
    };
    const onDurationChange = () => {
      updateDurationIfAvailable();
    };
    const onCanPlay = () => {
      updateDurationIfAvailable();
    };
    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    // If duration isn't available immediately, poll briefly (helps with flaky metadata from some servers)
    if (!updateDurationIfAvailable()) {
      let tries = 0;
      pollTimer = window.setInterval(() => {
        tries++;
        if (updateDurationIfAvailable() || tries >= 8) {
          if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
          }
        }
      }, 300);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [src]);

  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element missing");
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // sync currentTime into the audio element before playing (helps if user sought while paused)
    try {
      if (Math.abs(audio.currentTime - currentTime) > 0.5) {
        audio.currentTime = clamp(currentTime, 0, duration || 0);
      }
    } catch (e) {
      // ignore if audio isn't ready to set currentTime
    }

    try {
      // this must be called from user gesture (button) else it may reject
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play failed:", err);
    }
  };

  const onSeek = (val: number[]) => {
    const v = val?.[0] ?? 0;
    const target = clamp(Math.floor(v), 0, Math.max(0, duration || 0));
    setCurrentTime(target);
  };

  const onSeekStart = () => {
    setIsSeeking(true);
    isSeekingRef.current = true;
  };

  const onSeekEnd = (val: number[]) => {
    const v = val?.[0] ?? 0;
    const target = clamp(Math.floor(v), 0, Math.max(0, duration || 0));
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = target;
      } catch (_e) {}
    }
    setCurrentTime(target);
    setIsSeeking(false);
    isSeekingRef.current = false;
  };

  return (
    <div className={className}>
      {/* preload metadata only (keeps bandwidth low) */}
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>

        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={Math.max(1, Math.round(duration || 0))} // ensure slider max >= 1
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
  );
}
