import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  /** Extra classes on the <video> element */
  className?: string;
  /** Overlay opacity of the background veil, 0-100 */
  overlay?: number;
  /** Slowly scale the video for a subtle cinematic drift */
  kenburns?: boolean;
  /** Playback rate — below 1 makes the loop feel calmer */
  rate?: number;
};

/**
 * Background video that only downloads + plays once it scrolls into view,
 * pauses when off-screen, and respects reduced-motion preferences.
 */
export function BackgroundVideo({
  src,
  poster,
  className = "",
  overlay = 55,
  kenburns = false,
  rate = 0.8,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    el.playbackRate = rate;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setActive(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rate]);

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${
          kenburns ? "animate-kenburns" : ""
        } ${className}`}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        {active ? <source src={src} type="video/mp4" /> : null}
      </video>
      <div className="absolute inset-0 bg-[image:var(--gradient-veil)]" />
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlay / 100 }}
      />
    </>
  );
}
