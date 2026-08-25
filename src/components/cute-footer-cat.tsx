"use client";

import { useEffect, useRef } from "react";

const EDGE_GAP = 14;
const DESKTOP_WIDTH = 156;
const MOBILE_WIDTH = 118;
const WALK_DURATION = 6800;
const PAUSE_DURATION = 1100;
const START_DELAY = 900;

export function CuteFooterCat() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: 0,
    phase: "pause" as "walk" | "pause",
    direction: -1,
    phaseStarted: 0,
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
      cat.style.height = `${(width * 300) / 480}px`;
    };

    const bounds = () => {
      const rect = footer.getBoundingClientRect();
      const width = cat.offsetWidth;
      const height = cat.offsetHeight;
      const right = Math.max(EDGE_GAP, rect.width - width - EDGE_GAP);
      const center = Math.max(EDGE_GAP, Math.min(right, (rect.width - width) / 2));

      return {
        centerX: center,
        maxX: right,
        maxY: Math.max(EDGE_GAP, rect.height - height - EDGE_GAP),
      };
    };

    const setWalkingState = (walking: boolean, direction: number) => {
      cat.dataset.walking = walking ? "true" : "false";
      cat.dataset.direction = direction < 0 ? "left" : "right";
    };

    const home = () => {
      const b = bounds();
      state.current.x = b.maxX;
      state.current.direction = -1;
      state.current.phase = "pause";
      state.current.phaseStarted = performance.now() + START_DELAY;
      setWalkingState(false, -1);
    };

    const tick = (now: number) => {
      const s = state.current;
      const b = bounds();

      if (s.phaseStarted <= now) {
        if (s.phase === "pause") {
          s.phase = "walk";
          s.phaseStarted = now;
          setWalkingState(true, s.direction);
        } else {
          const progress = Math.min(1, (now - s.phaseStarted) / WALK_DURATION);
          const from = s.direction < 0 ? b.maxX : b.centerX;
          const to = s.direction < 0 ? b.centerX : b.maxX;
          const eased = progress * progress * (3 - 2 * progress);
          s.x = from + (to - from) * eased;

          if (progress >= 1) {
            s.x = to;
            s.direction *= -1;
            s.phase = "pause";
            s.phaseStarted = now + PAUSE_DURATION;
            setWalkingState(false, s.direction);
          }
        }
      }

      const idleBob = Math.sin(now / 560) * 1.2;
      const walkBob = s.phase === "walk" ? Math.sin(now / 105) * 1.8 : 0;
      const direction = s.direction < 0 ? 1 : -1;
      cat.style.transform = `translate3d(${s.x}px, ${b.maxY + idleBob + walkBob}px, 0) scaleX(${direction})`;

      last = now;
      raf = requestAnimationFrame(tick);
    };

    size();
    home();
    window.addEventListener("resize", size);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cute-footer-cat pointer-events-none absolute left-0 top-0 z-[60] select-none"
      style={{
        width: DESKTOP_WIDTH,
        aspectRatio: "480 / 300",
        transformOrigin: "center bottom",
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 480 300"
        width="480"
        height="300"
        className="block h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <linearGradient id="black-cat-fur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#20242b" />
            <stop offset="0.52" stopColor="#0c0f14" />
            <stop offset="1" stopColor="#05070a" />
          </linearGradient>
          <linearGradient id="black-cat-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#454b55" stopOpacity="0.9" />
            <stop offset="1" stopColor="#171b22" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cat-ear-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eaa6b6" />
            <stop offset="1" stopColor="#9d536d" />
          </linearGradient>
          <radialGradient id="cat-eye-iris" cx="42%" cy="35%" r="68%">
            <stop offset="0" stopColor="#fff4bb" />
            <stop offset="0.45" stopColor="#e8b75a" />
            <stop offset="1" stopColor="#a86c24" />
          </radialGradient>
          <filter id="cat-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="9" stdDeviation="7" floodOpacity="0.26" />
          </filter>
        </defs>

        <g filter="url(#cat-shadow)">
          <ellipse cx="255" cy="270" rx="103" ry="10" fill="#03050a" opacity="0.28" />

          <g className="cat-body">
            <path
              className="cat-tail"
              d="M330 218 C382 250 431 235 424 195 C421 175 397 169 389 187 C385 197 393 207 403 205"
              fill="none"
              stroke="url(#black-cat-fur)"
              strokeWidth="27"
              strokeLinecap="round"
            />
            <path
              d="M331 216 C380 242 422 228 417 194"
              fill="none"
              stroke="#5b626e"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.7"
            />

            <ellipse cx="277" cy="208" rx="79" ry="57" fill="url(#black-cat-fur)" stroke="#343a44" strokeWidth="3" />
            <ellipse cx="301" cy="190" rx="47" ry="30" fill="url(#black-cat-highlight)" opacity="0.42" />

            <g className="cat-leg cat-leg-back">
              <path d="M300 224 Q318 223 325 238 L324 262 Q314 271 300 263 Z" fill="#080b10" stroke="#343a44" strokeWidth="3" />
              <ellipse cx="313" cy="265" rx="19" ry="7" fill="#080b10" />
            </g>
            <g className="cat-leg cat-leg-front">
              <path d="M244 224 Q261 221 269 239 L268 263 Q257 272 243 263 Z" fill="#0a0d12" stroke="#343a44" strokeWidth="3" />
              <ellipse cx="256" cy="266" rx="19" ry="7" fill="#0a0d12" />
            </g>
          </g>

          <g className="cat-head">
            <path
              d="M174 154 L177 62 Q178 49 188 57 L228 90 Q254 79 279 91 L320 57 Q330 49 331 63 L334 153"
              fill="url(#black-cat-fur)"
              stroke="#343a44"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M188 72 L190 124 L219 96 Z" fill="url(#cat-ear-inner)" />
            <path d="M320 72 L318 124 L289 96 Z" fill="url(#cat-ear-inner)" />
            <path d="M191 69 L192 96 L207 83" fill="none" stroke="#6b727d" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
            <path d="M317 69 L316 96 L301 83" fill="none" stroke="#6b727d" strokeWidth="3" strokeLinecap="round" opacity="0.65" />

            <ellipse cx="254" cy="137" rx="77" ry="67" fill="url(#black-cat-fur)" stroke="#343a44" strokeWidth="3" />
            <path d="M204 105 Q254 75 304 105" fill="none" stroke="#555c67" strokeWidth="8" strokeLinecap="round" opacity="0.26" />

            <g className="cat-eyes">
              <ellipse cx="225" cy="132" rx="22" ry="27" fill="#fffdf4" stroke="#5a4a34" strokeWidth="2.5" />
              <ellipse cx="283" cy="132" rx="22" ry="27" fill="#fffdf4" stroke="#5a4a34" strokeWidth="2.5" />
              <ellipse cx="225" cy="134" rx="14" ry="19" fill="url(#cat-eye-iris)" />
              <ellipse cx="283" cy="134" rx="14" ry="19" fill="url(#cat-eye-iris)" />
              <ellipse cx="226" cy="135" rx="5" ry="12" fill="#050505" />
              <ellipse cx="284" cy="135" rx="5" ry="12" fill="#050505" />
              <circle cx="220" cy="125" r="4" fill="#fff" />
              <circle cx="278" cy="125" r="4" fill="#fff" />
            </g>

            <path d="M247 161 Q254 155 261 161 Q254 170 247 161Z" fill="#d8869b" stroke="#70414e" strokeWidth="1.5" />
            <path d="M254 169 Q247 180 237 172 M254 169 Q261 180 271 172" fill="none" stroke="#744b57" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M216 164 L166 157 M216 172 L162 171 M217 180 L168 188" stroke="#8d96a3" strokeWidth="2" strokeLinecap="round" opacity="0.88" />
            <path d="M292 164 L342 157 M292 172 L346 171 M291 180 L340 188" stroke="#8d96a3" strokeWidth="2" strokeLinecap="round" opacity="0.88" />

            <path d="M225 202 Q254 184 283 202 Q279 225 254 231 Q229 225 225 202Z" fill="#171b22" stroke="#343a44" strokeWidth="2.5" />
            <path d="M234 207 Q245 197 254 207 Q263 197 274 207" fill="none" stroke="#69717c" strokeWidth="2" opacity="0.55" />
          </g>
        </g>
      </svg>

      <style jsx>{`
        .cute-footer-cat[data-walking="true"] .cat-tail {
          animation: tail-walk 0.8s ease-in-out infinite alternate;
        }
        .cute-footer-cat[data-walking="true"] .cat-leg-front {
          animation: leg-front 0.34s ease-in-out infinite alternate;
        }
        .cute-footer-cat[data-walking="true"] .cat-leg-back {
          animation: leg-back 0.34s ease-in-out 0.17s infinite alternate;
        }
        .cat-tail {
          transform-origin: 332px 216px;
          animation: tail-idle 2.6s ease-in-out infinite;
        }
        .cat-eyes {
          transform-box: fill-box;
          transform-origin: center;
          animation: blink 2.9s ease-in-out infinite;
        }
        .cat-head {
          transform-origin: 254px 194px;
          animation: head-bob 1.05s ease-in-out infinite;
        }
        @keyframes tail-idle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes tail-walk {
          from { transform: rotate(-10deg); }
          to { transform: rotate(13deg); }
        }
        @keyframes leg-front {
          from { transform: translateY(0) rotate(-7deg); transform-origin: 256px 230px; }
          to { transform: translateY(-2px) rotate(8deg); transform-origin: 256px 230px; }
        }
        @keyframes leg-back {
          from { transform: translateY(-2px) rotate(8deg); transform-origin: 313px 230px; }
          to { transform: translateY(0) rotate(-7deg); transform-origin: 313px 230px; }
        }
        @keyframes head-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes blink {
          0%, 82%, 100% { transform: scaleY(1); }
          85%, 89% { transform: scaleY(0.07); }
          91% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cute-footer-cat[data-walking="true"] .cat-tail,
          .cute-footer-cat[data-walking="true"] .cat-leg-front,
          .cute-footer-cat[data-walking="true"] .cat-leg-back,
          .cat-tail,
          .cat-eyes,
          .cat-head {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
