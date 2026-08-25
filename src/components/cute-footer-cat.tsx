"use client";

import { useEffect, useState } from "react";

const FRAME_INTERVAL_MS = 200;

const POSES = [
  { x: 0, y: 0, scale: 1, rotate: 0 },
  { x: -2, y: -2, scale: 1.02, rotate: -1 },
  { x: 2, y: 2, scale: 1.03, rotate: 1 },
  { x: -1, y: 1, scale: 0.98, rotate: -2 },
  { x: 1, y: -1, scale: 1.02, rotate: 2 },
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
      className="cute-footer-cat pointer-events-none absolute bottom-2 right-3 select-none sm:bottom-3 sm:right-5"
      style={{
        width: "clamp(120px, 16vw, 190px)",
        height: "clamp(76px, 10vw, 120px)",
        zIndex: 50,
        transform: `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale}) rotate(${pose.rotate}deg)`,
        transformOrigin: "center bottom",
        transition: "transform 90ms ease-out",
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 300 189"
        className="h-full w-full overflow-visible"
        role="presentation"
        focusable="false"
      >
        <g fill="#09090b" stroke="#6366f1" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M52 142c18-31 38-47 70-51 30-4 62 3 86 18 20 12 34 28 51 31 12 2 20-3 25-10 4-6 9-5 10 2 2 13-7 25-21 30-22 8-43-1-60-12-21-14-43-19-67-17-24 2-43 13-59 27-13 11-25 15-35 10-8-4-10-15 0-28Z" />
          <path d="M75 101c-5-22-2-42 9-57l15 22c8-8 18-13 29-16l5-27 18 25c18 2 33 11 42 25 12 18 12 41 3 58-10 18-31 28-55 27-32-1-58-21-66-57Z" />
          <path d="M104 71 96 51l15 11M151 49l4-23 17 22" />
          <path d="M105 101c5-4 11-4 16 0M146 101c5-4 11-4 16 0" fill="none" />
          <path d="M126 113c5 4 10 4 15 0" fill="none" />
          <path d="M89 113 58 108M89 119 57 121M166 113l31-5M166 119l32 2" fill="none" />
          <path d="M111 141c-1 14-1 25-7 33M139 137c1 14 1 27 7 37M168 143c2 12 4 21 12 29" fill="none" />
          <path d="M100 173h16M137 177h16M174 172h16" fill="none" />
        </g>
        <circle cx="116" cy="96" r="3.2" fill="#6366f1" />
        <circle cx="154" cy="96" r="3.2" fill="#6366f1" />
      </svg>
    </div>
  );
}
