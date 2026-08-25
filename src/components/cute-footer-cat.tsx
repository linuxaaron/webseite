"use client";

import { useEffect, useRef } from "react";

const CAT_ART = "/cat-footer-reference.svg";
const FOLLOW_DISTANCE = 95;
const EDGE_GAP = 14;
const DESKTOP_WIDTH = 150;
const MOBILE_WIDTH = 112;

export function CuteFooterCat() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    pointerX: 0,
    pointerY: 0,
    pointerInside: false,
  });

  useEffect(() => {
    const cat = ref.current;
    const footer = cat?.closest("footer");
    if (!cat || !footer) return;

    let raf = 0;
    let last = performance.now();

    const size = () => {
      const width = window.innerWidth < 640 ? MOBILE_WIDTH : DESKTOP_WIDTH;
      cat.style.width = `${width}px`;
      cat.style.height = `${(width * 255) / 405}px`;
    };

    const bounds = () => {
      const rect = footer.getBoundingClientRect();
      const width = cat.offsetWidth;
      const height = cat.offsetHeight;
      return {
        rect,
        minX: EDGE_GAP,
        minY: EDGE_GAP,
        maxX: Math.max(EDGE_GAP, rect.width - width - EDGE_GAP),
        maxY: Math.max(EDGE_GAP, rect.height - height - EDGE_GAP),
      };
    };

    const home = () => {
      const b = bounds();
      state.current.x = b.maxX;
      state.current.y = b.maxY;
      state.current.vx = 0;
      state.current.vy = 0;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const b = bounds();
      const inside =
        event.clientX >= b.rect.left &&
        event.clientX <= b.rect.right &&
        event.clientY >= b.rect.top &&
        event.clientY <= b.rect.bottom;

      state.current.pointerInside = inside;
      if (inside) {
        state.current.pointerX = event.clientX - b.rect.left;
        state.current.pointerY = event.clientY - b.rect.top;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const s = state.current;
      const b = bounds();

      let targetX = b.maxX;
      let targetY = b.maxY;

      if (s.pointerInside) {
        const centerX = s.x + cat.offsetWidth / 2;
        const centerY = s.y + cat.offsetHeight / 2;
        const dx = centerX - s.pointerX;
        const dy = centerY - s.pointerY;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance > FOLLOW_DISTANCE) {
          targetX = s.pointerX + (dx / distance) * FOLLOW_DISTANCE - cat.offsetWidth / 2;
          targetY = s.pointerY + (dy / distance) * FOLLOW_DISTANCE - cat.offsetHeight / 2;
        } else {
          targetX = s.x;
          targetY = s.y;
        }
      } else {
        const time = now / 1000;
        targetX = b.maxX - Math.sin(time * 0.35) * 28;
        targetY = b.maxY - 8 - Math.sin(time * 0.55) * 5;
      }

      targetX = Math.min(b.maxX, Math.max(b.minX, targetX));
      targetY = Math.min(b.maxY, Math.max(b.minY, targetY));

      const stiffness = s.pointerInside ? 0.00075 : 0.00045;
      const damping = 0.92;
      s.vx = s.vx * damping + (targetX - s.x) * stiffness * dt;
      s.vy = s.vy * damping + (targetY - s.y) * stiffness * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const bob = Math.sin(now / 700) * 1.8;
      const tilt =
        Math.sin(now / 1400) * 0.8 +
        Math.max(-1.5, Math.min(1.5, s.vx * 0.08));

      cat.style.transform = `translate3d(${s.x}px, ${s.y + bob}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const leave = () => {
      state.current.pointerInside = false;
    };

    size();
    home();
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", move, { passive: true });
    footer.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cute-footer-cat pointer-events-none absolute left-0 top-0 z-[60] select-none"
      style={{
        width: DESKTOP_WIDTH,
        aspectRatio: "405 / 255",
        willChange: "transform",
        WebkitMaskImage: `url(${CAT_ART})`,
        maskImage: `url(${CAT_ART})`,
        WebkitMaskMode: "luminance",
        maskMode: "luminance",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      <img
        src={CAT_ART}
        alt=""
        width={455}
        height={280}
        draggable={false}
        className="block h-full w-full object-contain"
      />
      <span className="cat-blink" />
      <style jsx>{`
        .cat-blink {
          position: absolute;
          left: 28.8%;
          top: 44.7%;
          width: 6.2%;
          height: 11.5%;
          border-radius: 50%;
          background: #fff;
          opacity: 0;
          animation: blink 5.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 88%, 100% { opacity: 0; transform: scaleY(.15); }
          90%, 94% { opacity: 1; transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cat-blink { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
