"use client";

import { useEffect, useState } from "react";

const FRAME_INTERVAL_MS = 200;

const POSES = [
  { x: 0, y: 0, scale: 1, rotate: 0 },
  { x: -3, y: -2, scale: 1.03, rotate: -1 },
  { x: 2, y: 3, scale: 1.04, rotate: 1 },
  { x: -1, y: 1, scale: 0.98, rotate: -2 },
  { x: 1, y: -1, scale: 1.01, rotate: 2 },
  { x: 3, y: 0, scale: 1, rotate: -1 },
] as const;

export function CuteFooterCat() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % POSES.length);
    }, FRAME_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const pose = POSES[frame];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-2 right-3 z-30 select-none sm:bottom-3 sm:right-5"
      style={{
        width: "clamp(120px, 16vw, 190px)",
        aspectRatio: "300 / 189",
      }}
    >
      <img
        src="/cat-footer-transparent.svg"
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
        style={{
          filter: "brightness(0.2) contrast(1.18) saturate(0.8)",
          transform: `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale}) rotate(${pose.rotate}deg)`,
          transformOrigin: "center bottom",
          transition: "transform 90ms ease-out",
          willChange: "transform",
        }}
      />
    </div>
  );
}
