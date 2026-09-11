import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface CinematicVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Placeholder label shown when the video asset is absent. */
  label?: string;
  tint?: string;
  /** Overlay gradient strength for text readability (0–1). */
  overlay?: number;
  /** Show the sound toggle. */
  withSound?: boolean;
  /**
   * Attempt to autoplay WITH sound. Browsers usually block this until the
   * user has interacted with the page, so we gracefully fall back to muted
   * autoplay + enabling audio on the first click/tap/keypress. Desktop only.
   */
  preferSound?: boolean;
  /**
   * Optional 0..1 signal (e.g. scroll-driven video opacity) that the audio
   * volume tracks, so sound fades out exactly as the video fades away.
   */
  volumeSignal?: MotionValue<number>;
  /** Override the <video> preload strategy (default: metadata / none on mobile). */
  preload?: "auto" | "metadata" | "none";
  /**
   * CSS object-position for the video (object-fit stays "cover"). Lets a caller
   * bias the crop so the important part of the subject (e.g. the head) stays in
   * frame. Defaults to "center".
   */
  objectPosition?: string;
}

/**
 * Full-bleed background video done responsibly:
 *  • autoplays MUTED (browser-safe) with a poster fallback
 *  • unobtrusive "Sound on" toggle (audio only after a user gesture)
 *  • play/pause control
 *  • readability gradient overlay
 *  • on mobile OR when the file is missing, shows a cinematic
 *    poster/placeholder instead of a heavy autoplaying video.
 */
export function CinematicVideo({
  src,
  poster,
  className,
  label = "background video",
  tint = "#FFCC1D",
  overlay = 0.55,
  withSound = true,
  preferSound = false,
  volumeSignal,
  preload,
  objectPosition = "center",
}: CinematicVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const isMobile = useIsMobile();

  // Audio volume follows the supplied signal (video opacity), so as the video
  // visually fades the sound fades with it and reaches silence together.
  useEffect(() => {
    if (!volumeSignal) return;
    const apply = (val: number) => {
      const v = ref.current;
      if (v) v.volume = Math.min(1, Math.max(0, val));
    };
    apply(volumeSignal.get());
    return volumeSignal.on("change", apply);
  }, [volumeSignal]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let cleanup: (() => void) | undefined;

    // Muted-autoplay fallback (always browser-safe).
    const startMuted = () => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => setPlaying(false));
    };

    // Enable audio on the first genuine user interaction (not scroll).
    const armInteractionUnmute = () => {
      const onFirst = () => {
        v.muted = false;
        setMuted(false);
        v.play().catch(() => {});
        remove();
      };
      const remove = () => {
        window.removeEventListener("pointerdown", onFirst);
        window.removeEventListener("keydown", onFirst);
        window.removeEventListener("touchstart", onFirst);
      };
      window.addEventListener("pointerdown", onFirst, { once: true });
      window.addEventListener("keydown", onFirst, { once: true });
      window.addEventListener("touchstart", onFirst, { once: true });
      cleanup = remove;
    };

    if (preferSound && !isMobile) {
      // Try autoplay WITH sound; fall back to muted + unmute-on-interaction.
      v.muted = false;
      v.play()
        .then(() => setMuted(false))
        .catch(() => {
          startMuted();
          armInteractionUnmute();
        });
    } else {
      startMuted();
    }

    return () => cleanup?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
    setPlaying(!v.paused);
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const showPlaceholder = failed;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {!showPlaceholder && (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload={preload ?? (isMobile ? "none" : "metadata")}
          onError={() => setFailed(true)}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {showPlaceholder && (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, ${tint}12, transparent 55%), linear-gradient(180deg,#0A1A3F,#050D24)`,
          }}
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted/55">
            {label} · drop the file to replace
          </span>
        </div>
      )}

      {/* readability overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(5,13,36,${overlay * 0.5}) 0%, rgba(5,13,36,${overlay * 0.2}) 40%, rgba(5,13,36,${overlay}) 100%)`,
        }}
      />

      {/* controls */}
      {withSound && !showPlaceholder && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause background video" : "Play background video"}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-content/80 transition hover:text-content"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Mute video"}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-content/80 transition hover:text-content"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{muted ? "Sound on" : "Mute"}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
