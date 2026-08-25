"use client";

import { useEffect, useRef } from "react";

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
      cat.style.height = `${(width * 280) / 455}px`;
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

    const leave = () => {
      state.current.pointerInside = false;
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
        aspectRatio: "455 / 280",
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 455 280"
        width="455"
        height="280"
        className="block h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <linearGradient id="cat-fur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e9edf3" />
          </linearGradient>
          <linearGradient id="cat-ear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffc6cf" />
            <stop offset="1" stopColor="#f29aa8" />
          </linearGradient>
          <radialGradient id="cat-eye" cx="45%" cy="38%" r="65%">
            <stop offset="0" stopColor="#8fe8ff" />
            <stop offset="0.45" stopColor="#35b9ed" />
            <stop offset="1" stopColor="#0877b6" />
          </radialGradient>
          <filter id="cat-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity="0.28" />
          </filter>
        </defs>

        <g filter="url(#cat-shadow)">
          <ellipse cx="251" cy="252" rx="104" ry="11" fill="#0b1220" opacity="0.22" />

          <path
            className="cat-tail"
            d="M335 210 C390 238 422 210 405 175 C395 154 372 163 381 182 C388 198 405 187 397 174"
            fill="none"
            stroke="url(#cat-fur)"
            strokeWidth="25"
            strokeLinecap="round"
          />
          <path
            d="M335 210 C390 238 422 210 405 175"
            fill="none"
            stroke="#cbd2dc"
            strokeWidth="2.5"
            opacity="0.8"
          />

          <ellipse cx="280" cy="193" rx="77" ry="58" fill="url(#cat-fur)" stroke="#b9c1cc" strokeWidth="3" />
          <ellipse cx="224" cy="205" rx="48" ry="36" fill="#f7f9fb" stroke="#b9c1cc" strokeWidth="3" />

          <path
            d="M184 134 L177 55 Q177 45 186 51 L224 82 L265 51 Q273 45 272 56 L268 133"
            fill="url(#cat-fur)"
            stroke="#b9c1cc"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M188 65 L190 107 L217 85 Z" fill="url(#cat-ear)" />
          <path d="M260 65 L258 106 L231 85 Z" fill="url(#cat-ear)" />

          <ellipse cx="224" cy="126" rx="65" ry="60" fill="url(#cat-fur)" stroke="#b9c1cc" strokeWidth="3" />
          <path d="M197 87 Q224 69 251 87" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.9" />

          <ellipse cx="202" cy="121" rx="18" ry="23" fill="#fff" stroke="#4a5563" strokeWidth="2.5" />
          <ellipse cx="247" cy="121" rx="18" ry="23" fill="#fff" stroke="#4a5563" strokeWidth="2.5" />
          <ellipse className="cat-eye" cx="205" cy="124" rx="10" ry="15" fill="url(#cat-eye)" />
          <ellipse className="cat-eye" cx="244" cy="124" rx="10" ry="15" fill="url(#cat-eye)" />
          <ellipse cx="208" cy="119" rx="3.5" ry="6" fill="#fff" />
          <ellipse cx="247" cy="119" rx="3.5" ry="6" fill="#fff" />

          <path d="M219 143 Q224 139 229 143 Q224 150 219 143Z" fill="#e98798" stroke="#8f5964" strokeWidth="1.5" />
          <path d="M224 149 Q218 159 209 151 M224 149 Q230 159 239 151" fill="none" stroke="#7a515a" strokeWidth="2" strokeLinecap="round" />

          <path d="M189 144 L151 137 M190 151 L149 153 M191 158 L155 168" stroke="#7b8795" strokeWidth="2" strokeLinecap="round" />
          <path d="M259 144 L297 137 M258 151 L299 153 M257 158 L293 168" stroke="#7b8795" strokeWidth="2" strokeLinecap="round" />

          <path d="M205 191 Q223 175 241 191 Q239 211 223 217 Q207 211 205 191Z" fill="#f9fbfd" stroke="#b9c1cc" strokeWidth="2.5" />
          <path d="M209 197 Q219 188 223 197 Q227 188 237 197" fill="none" stroke="#c7ced8" strokeWidth="2" />

          <g className="cat-paw cat-paw-left">
            <ellipse cx="193" cy="220" rx="22" ry="15" fill="#fff" stroke="#b9c1cc" strokeWidth="3" />
            <circle cx="187" cy="220" r="3" fill="#f2a3b1" />
            <circle cx="197" cy="218" r="3" fill="#f2a3b1" />
          </g>
          <g className="cat-paw cat-paw-right">
            <ellipse cx="246" cy="220" rx="22" ry="15" fill="#fff" stroke="#b9c1cc" strokeWidth="3" />
            <circle cx="240" cy="220" r="3" fill="#f2a3b1" />
            <circle cx="250" cy="218" r="3" fill="#f2a3b1" />
          </g>

          <g className="cat-yarn">
            <circle cx="124" cy="229" r="23" fill="#5fc7ff" stroke="#1876a9" strokeWidth="3" />
            <path d="M106 221 Q124 236 143 218 M104 231 Q123 244 145 226 M111 211 Q125 222 140 209" fill="none" stroke="#d8f4ff" strokeWidth="2" opacity="0.9" />
            <path d="M143 230 C165 245 177 238 188 229 C202 218 213 225 224 230" fill="none" stroke="#55baf1" strokeWidth="4" strokeLinecap="round" />
          </g>

          <g className="cat-sparkles" fill="#48c8ff">
            <path d="M110 151 l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
            <path d="M303 92 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            <circle cx="331" cy="137" r="4" />
          </g>
        </g>
      </svg>

      <style jsx>{`
        .cat-tail {
          transform-origin: 337px 209px;
          animation: tail 2.8s ease-in-out infinite;
        }
        .cat-paw-left {
          transform-origin: 193px 220px;
          animation: paw-left 3.4s ease-in-out infinite;
        }
        .cat-paw-right {
          transform-origin: 246px 220px;
          animation: paw-right 3.4s ease-in-out infinite;
        }
        .cat-yarn {
          transform-origin: 124px 229px;
          animation: yarn 3.4s ease-in-out infinite;
        }
        .cat-sparkles {
          animation: sparkle 2.6s ease-in-out infinite;
        }
        .cat-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: blink 5.2s ease-in-out infinite;
        }
        @keyframes tail {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes paw-left {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-3deg); }
        }
        @keyframes paw-right {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(2px) rotate(3deg); }
        }
        @keyframes yarn {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-4deg) translateY(-2px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: .55; transform: scale(.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes blink {
          0%, 88%, 100% { transform: scaleY(1); }
          90%, 94% { transform: scaleY(.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cat-tail,
          .cat-paw-left,
          .cat-paw-right,
          .cat-yarn,
          .cat-sparkles,
          .cat-eye { animation: none; }
        }
      `}</style>
    </div>
  );
}
