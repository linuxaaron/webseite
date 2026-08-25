"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * CuteFooterCat
 * ---------------------------------------------------------------------------
 * A fully vector (inline SVG), theme-aware kitten that lives inside <footer>.
 *
 * Design goals / how this replaces the previous implementation:
 * - No raster image + mixBlendMode hack (that left a visible halo box in
 *   light mode because "screen" blending only truly disappears on a pure
 *   black backdrop). Everything below is real vector shapes, so it adapts
 *   to light/dark theme via CSS variables and can be posed part-by-part.
 * - JS owns POSITION only (where the cat is inside the footer + facing
 *   direction). CSS owns POSE ("acting" - sitting, playing, stretching...).
 *   That split keeps both halves easy to reason about and to extend.
 * - The cat NEVER blocks a click: the whole widget is pointer-events:none.
 *   On top of that hard guarantee, it actively steers around every
 *   interactive element in the footer (links, buttons, inputs) so it also
 *   never visually sits on top of them.
 */

type Mood = "sit" | "play" | "stretch" | "groom" | "wink" | "look" | "lie";

const MOODS: Mood[] = ["sit", "play", "stretch", "groom", "wink", "look", "lie"];

// How long each pose plays before the next one is picked (ms).
const MOOD_DURATION: Record<Mood, number> = {
  sit: 4400,
  play: 5200,
  stretch: 2600,
  groom: 3800,
  wink: 1500,
  look: 2800,
  lie: 6200,
};

// Poses that are only picked while the cat is resting (not being chased by
// a pointer) - stretching/lying down mid-chase would look wrong.
const IDLE_ONLY: Mood[] = ["stretch", "lie", "groom"];

const EDGE_GAP = 10; // keep clear of the footer's own edges
const OBSTACLE_PADDING = 12; // extra clearance kept around links/buttons/inputs
const FOLLOW_RADIUS = 78; // the cat stops this far from the pointer, never under it
const TOUCH_LOOK_MS = 1400; // how long a tap "look" lasts before returning to idle

const INTERACTIVE_SELECTOR =
  'a[href], button, input, textarea, select, label, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

type Rect = { left: number; top: number; right: number; bottom: number };

function pickNextMood(current: Mood, resting: boolean): Mood {
  const pool = MOODS.filter((m) => m !== current && (resting || !IDLE_ONLY.includes(m)));
  return pool[Math.floor(Math.random() * pool.length)] ?? "sit";
}

export function CuteFooterCat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("sit");
  const [facing, setFacing] = useState<"right" | "left">("left");

  const obstacles = useRef<Rect[]>([]);
  const pos = useRef({ x: 0, y: 0, homeX: 0, homeY: 0 });
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const touchLook = useRef<{ x: number; y: number; until: number } | null>(null);
  const restingRef = useRef(true);

  const recomputeObstacles = useCallback(() => {
    const footer = wrapRef.current?.closest("footer");
    if (!footer) return;
    const footerRect = footer.getBoundingClientRect();
    const nodes = footer.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR);
    const next: Rect[] = [];
    nodes.forEach((el) => {
      // The cat itself is inert (pointer-events:none) and never a target.
      if (el.closest(".cute-footer-cat")) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      next.push({
        left: r.left - footerRect.left - OBSTACLE_PADDING,
        top: r.top - footerRect.top - OBSTACLE_PADDING,
        right: r.right - footerRect.left + OBSTACLE_PADDING,
        bottom: r.bottom - footerRect.top + OBSTACLE_PADDING,
      });
    });
    obstacles.current = next;
  }, []);

  // Mood cycle: pick a new pose repeatedly for as long as it's allowed to run.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // stay on the calm default "sit" pose, no cycling

    let timer = 0;
    const advance = () => {
      setMood((prev) => {
        const next = pickNextMood(prev, restingRef.current);
        timer = window.setTimeout(advance, MOOD_DURATION[next]);
        return next;
      });
    };
    timer = window.setTimeout(advance, MOOD_DURATION.sit);
    return () => window.clearTimeout(timer);
  }, []);

  // Position + pointer-follow + collision-avoidance loop.
  useEffect(() => {
    const cat = wrapRef.current;
    const footer = cat?.closest("footer") as HTMLElement | null;
    if (!cat || !footer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bounds = () => {
      const rect = footer.getBoundingClientRect();
      const w = cat.offsetWidth;
      const h = cat.offsetHeight;
      return {
        rect,
        minX: EDGE_GAP,
        minY: EDGE_GAP,
        maxX: Math.max(EDGE_GAP, rect.width - w - EDGE_GAP),
        maxY: Math.max(EDGE_GAP, rect.height - h - EDGE_GAP),
      };
    };

    const home = () => {
      const b = bounds();
      pos.current.homeX = b.maxX;
      pos.current.homeY = b.maxY;
      pos.current.x = b.maxX;
      pos.current.y = b.maxY;
      cat.style.transform = `translate3d(${b.maxX}px, ${b.maxY}px, 0)`;
    };

    // Push (x, y) out of every obstacle rectangle it currently overlaps.
    // Pure AABB minimum-translation-vector resolution, cheap enough to run
    // every frame since there are only a handful of interactive elements.
    const resolveCollisions = (x: number, y: number, w: number, h: number) => {
      let rx = x;
      let ry = y;
      for (const o of obstacles.current) {
        const left = rx;
        const top = ry;
        const right = rx + w;
        const bottom = ry + h;
        const overlapX = Math.min(right, o.right) - Math.max(left, o.left);
        const overlapY = Math.min(bottom, o.bottom) - Math.max(top, o.top);
        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
            // push out sideways, away from the obstacle's center
            const centerX = (o.left + o.right) / 2;
            rx += rx + w / 2 < centerX ? -overlapX : overlapX;
          } else {
            const centerY = (o.top + o.bottom) / 2;
            ry += ry + h / 2 < centerY ? -overlapY : overlapY;
          }
        }
      }
      return { x: rx, y: ry };
    };

    let raf = 0;
    let lastFacingFlip = 0;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const b = bounds();
      const inside =
        event.clientX >= b.rect.left &&
        event.clientX <= b.rect.right &&
        event.clientY >= b.rect.top &&
        event.clientY <= b.rect.bottom;
      pointer.current.inside = inside;
      if (inside) {
        pointer.current.x = event.clientX - b.rect.left;
        pointer.current.y = event.clientY - b.rect.top;
      }
    };
    const leave = () => {
      pointer.current.inside = false;
    };

    // A tap on empty footer space makes the cat glance that way briefly.
    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;
      const touch = event.touches[0];
      if (!touch) return;
      const b = bounds();
      touchLook.current = {
        x: touch.clientX - b.rect.left,
        y: touch.clientY - b.rect.top,
        until: performance.now() + TOUCH_LOOK_MS,
      };
    };

    const tick = (now: number) => {
      const b = bounds();
      const w = cat.offsetWidth;
      const h = cat.offsetHeight;
      let targetX = b.maxX;
      let targetY = b.maxY;
      let chasing = false;

      if (pointer.current.inside) {
        chasing = true;
        const cx = pos.current.x + w / 2;
        const cy = pos.current.y + h / 2;
        const dx = cx - pointer.current.x;
        const dy = cy - pointer.current.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > FOLLOW_RADIUS) {
          targetX = pointer.current.x + (dx / dist) * FOLLOW_RADIUS - w / 2;
          targetY = pointer.current.y + (dy / dist) * FOLLOW_RADIUS - h / 2;
        } else {
          targetX = pos.current.x;
          targetY = pos.current.y;
        }
      } else if (touchLook.current && now < touchLook.current.until) {
        chasing = true;
        const dx = touchLook.current.x - (pos.current.x + w / 2);
        const dy = touchLook.current.y - (pos.current.y + h / 2);
        targetX = pos.current.x + dx * 0.18;
        targetY = pos.current.y + dy * 0.18;
      } else {
        touchLook.current = null;
        if (!reduced) {
          const t = now / 1000;
          targetX = b.maxX - (Math.sin(t * 0.35) * 0.5 + 0.5) * 34;
          targetY = b.maxY - Math.abs(Math.sin(t * 0.55)) * 6;
        }
      }

      restingRef.current = !chasing;

      targetX = Math.min(b.maxX, Math.max(b.minX, targetX));
      targetY = Math.min(b.maxY, Math.max(b.minY, targetY));

      const ease = reduced ? 1 : chasing ? 0.05 : 0.035;
      const prevX = pos.current.x;
      pos.current.x += (targetX - pos.current.x) * ease;
      pos.current.y += (targetY - pos.current.y) * ease;

      const resolved = resolveCollisions(pos.current.x, pos.current.y, w, h);
      pos.current.x = Math.min(b.maxX, Math.max(b.minX, resolved.x));
      pos.current.y = Math.min(b.maxY, Math.max(b.minY, resolved.y));

      const vx = pos.current.x - prevX;
      if (now - lastFacingFlip > 220 && Math.abs(vx) > 0.15) {
        lastFacingFlip = now;
        setFacing(vx < 0 ? "left" : "right");
      }

      const bob = reduced ? 0 : Math.sin(now / 720) * 1.6;
      cat.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y + bob}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    home();
    recomputeObstacles();

    const onResize = () => {
      recomputeObstacles();
    };
    let mutationTimer = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(recomputeObstacles, 150);
    });
    observer.observe(footer, { childList: true, subtree: true, attributes: true });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", move, { passive: true });
    footer.addEventListener("pointerleave", leave);
    footer.addEventListener("touchstart", onTouchStart, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(mutationTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
      footer.removeEventListener("touchstart", onTouchStart);
    };
  }, [recomputeObstacles]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="cute-footer-cat pointer-events-none absolute left-0 top-0 z-[60] select-none"
      data-mood={mood}
      data-facing={facing}
      style={{ willChange: "transform" }}
    >
      <div className="cc-stage">
        <svg viewBox="0 0 220 190" className="cc-svg" role="img" aria-hidden="true">
          <ellipse className="cc-shadow" cx="112" cy="172" rx="46" ry="7" />

          <g className="cc-cat">
            <path
              className="cc-tail-outline"
              d="M150,158 C176,160 194,146 196,122 C197,106 188,94 176,96 C167,98 165,108 173,112"
            />
            <path
              className="cc-tail"
              d="M150,158 C176,160 194,146 196,122 C197,106 188,94 176,96 C167,98 165,108 173,112"
            />

            <g className="cc-yarn">
              <path className="cc-yarn-string" d="M108,165 C130,178 150,180 156,168" />
              <circle className="cc-yarn-ball" cx="168" cy="163" r="13" />
              <path
                className="cc-yarn-texture"
                d="M158,158 C166,166 172,166 178,159 M157,164 C166,170 172,168 179,164 M160,170 C167,173 173,171 177,168"
              />
            </g>

            <path
              className="cc-body"
              d="M112,86 C146,86 166,112 166,142 C166,164 141,176 112,176 C83,176 58,164 58,142 C58,112 78,86 112,86 Z"
            />

            <g className="cc-paw cc-paw-left">
              <ellipse cx="90" cy="170" rx="13" ry="10" />
            </g>
            <g className="cc-paw cc-paw-right">
              <ellipse cx="134" cy="170" rx="13" ry="10" />
            </g>

            <g className="cc-head">
              <path className="cc-ear cc-ear-left" d="M74,52 L64,16 L104,42 Z" />
              <path className="cc-ear-inner cc-ear-left" d="M80,48 L74,24 L98,40 Z" />
              <path className="cc-ear cc-ear-right" d="M150,52 L160,16 L120,42 Z" />
              <path className="cc-ear-inner cc-ear-right" d="M144,48 L150,24 L126,40 Z" />

              <circle className="cc-face" cx="112" cy="76" r="42" />

              <ellipse className="cc-blush" cx="84" cy="88" rx="9" ry="5" />
              <ellipse className="cc-blush" cx="140" cy="88" rx="9" ry="5" />

              <g className="cc-eye cc-eye-left">
                <ellipse className="cc-iris" cx="94" cy="74" rx="8.5" ry="10" />
                <ellipse className="cc-pupil" cx="94" cy="77" rx="4.5" ry="5.5" />
                <circle className="cc-glint" cx="91.5" cy="72" r="1.8" />
                <path className="cc-lid" d="M85,74 Q94,60 103,74 Q94,68 85,74 Z" />
              </g>
              <g className="cc-eye cc-eye-right">
                <ellipse className="cc-iris" cx="130" cy="74" rx="8.5" ry="10" />
                <ellipse className="cc-pupil" cx="130" cy="77" rx="4.5" ry="5.5" />
                <circle className="cc-glint" cx="127.5" cy="72" r="1.8" />
                <path className="cc-lid" d="M121,74 Q130,60 139,74 Q130,68 121,74 Z" />
              </g>

              <path className="cc-nose" d="M108,90 L116,90 L112,95 Z" />
              <path className="cc-mouth" d="M112,95 Q112,99 105,99 Q100,99 98,95 M112,95 Q112,99 119,99 Q124,99 126,95" />

              <path className="cc-whiskers" d="M64,86 L36,82 M64,92 L34,92 M64,98 L36,102" />
              <path className="cc-whiskers" d="M160,86 L188,82 M160,92 L190,92 M160,98 L188,102" />
            </g>
          </g>

          <path className="cc-sparkle cc-sparkle-a" d="M182,52 L185,60 L193,63 L185,66 L182,74 L179,66 L171,63 L179,60 Z" />
          <path className="cc-sparkle cc-sparkle-b" d="M40,58 L42,63 L47,65 L42,67 L40,72 L38,67 L33,65 L38,63 Z" />
        </svg>
      </div>

      <style jsx>{`
        .cute-footer-cat {
          --cc-fur: #fdfdff;
          --cc-fur-outline: color-mix(in srgb, var(--text) 22%, transparent);
          --cc-ear: #ffc9d9;
          --cc-nose: #ff8fae;
          --cc-mouth: #c9a9b4;
          --cc-eye: #57b8ff;
          --cc-pupil: #12294a;
          --cc-shadow: color-mix(in srgb, var(--text) 16%, transparent);
          --cc-yarn: #7ec8ea;
          --cc-yarn-dark: #4f9dc4;
          isolation: isolate;
          width: clamp(92px, 16vw, 148px);
          aspect-ratio: 220 / 190;
        }
        :global(.dark) .cute-footer-cat {
          --cc-fur: #eef0ff;
          --cc-fur-outline: color-mix(in srgb, var(--text) 30%, transparent);
          --cc-shadow: rgba(0, 0, 0, 0.45);
        }
        .cc-stage {
          width: 100%;
          height: 100%;
          transition: transform 0.35s ease;
          transform: scaleX(1);
        }
        .cute-footer-cat[data-facing="right"] .cc-stage {
          transform: scaleX(-1);
        }
        .cc-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          display: block;
        }

        .cc-shadow {
          fill: var(--cc-shadow);
        }

        .cc-body,
        .cc-face,
        .cc-ear,
        .cc-paw ellipse {
          fill: var(--cc-fur);
          stroke: var(--cc-fur-outline);
          stroke-width: 1.5px;
        }
        .cc-ear-inner {
          fill: var(--cc-ear);
        }
        .cc-tail-outline {
          fill: none;
          stroke: var(--cc-fur-outline);
          stroke-width: 18px;
          stroke-linecap: round;
        }
        .cc-tail {
          fill: none;
          stroke: var(--cc-fur);
          stroke-width: 15px;
          stroke-linecap: round;
          transform-box: fill-box;
          transform-origin: 4% 92%;
        }
        .cc-tail-outline {
          transform-box: fill-box;
          transform-origin: 4% 92%;
        }

        .cc-blush {
          fill: var(--cc-ear);
          opacity: 0.55;
        }
        .cc-iris {
          fill: var(--cc-eye);
        }
        .cc-pupil {
          fill: var(--cc-pupil);
        }
        .cc-glint {
          fill: #fff;
        }
        .cc-lid {
          fill: var(--cc-fur);
          transform-box: fill-box;
          transform-origin: 50% 100%;
          transform: scaleY(0);
        }
        .cc-nose {
          fill: var(--cc-nose);
        }
        .cc-mouth {
          fill: none;
          stroke: var(--cc-mouth);
          stroke-width: 1.6px;
          stroke-linecap: round;
        }
        .cc-whiskers {
          fill: none;
          stroke: var(--cc-fur-outline);
          stroke-width: 1.4px;
          stroke-linecap: round;
        }

        .cc-yarn {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          opacity: 0;
          transform: scale(0.4);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .cc-yarn-string {
          fill: none;
          stroke: var(--cc-yarn);
          stroke-width: 2px;
          stroke-linecap: round;
        }
        .cc-yarn-ball {
          fill: var(--cc-yarn);
          stroke: var(--cc-yarn-dark);
          stroke-width: 1.4px;
        }
        .cc-yarn-texture {
          fill: none;
          stroke: var(--cc-yarn-dark);
          stroke-width: 1.3px;
          stroke-linecap: round;
          opacity: 0.8;
        }

        .cc-sparkle {
          fill: var(--accent);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }

        .cc-ear,
        .cc-ear-inner {
          transform-box: fill-box;
          transform-origin: 50% 100%;
        }
        .cc-paw {
          transform-box: fill-box;
          transform-origin: 50% 20%;
        }
        .cc-head {
          transform-box: fill-box;
          transform-origin: 50% 85%;
        }
        .cc-body {
          transform-box: fill-box;
          transform-origin: 50% 100%;
        }

        /* ---- ambient motion: always running, independent of mood ---- */
        .cc-body {
          animation: cc-breathe 3.4s ease-in-out infinite;
        }
        .cc-tail,
        .cc-tail-outline {
          animation: cc-tail-idle 2.8s ease-in-out infinite;
        }
        .cc-eye-left .cc-lid {
          animation: cc-blink 5.2s ease-in-out infinite;
        }
        .cc-eye-right .cc-lid {
          animation: cc-blink 5.2s ease-in-out infinite 0.05s;
        }

        @keyframes cc-breathe {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.02);
          }
        }
        @keyframes cc-tail-idle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-7deg);
          }
        }
        @keyframes cc-blink {
          0%,
          92%,
          100% {
            transform: scaleY(0);
          }
          95%,
          97% {
            transform: scaleY(1);
          }
        }

        /* ---- pose-specific overrides (win by attribute-selector specificity) ---- */
        .cute-footer-cat[data-mood="play"] .cc-yarn {
          opacity: 1;
          transform: scale(1);
          animation: cc-yarn-roll 1.6s ease-in-out infinite;
        }
        .cute-footer-cat[data-mood="play"] .cc-paw-right {
          animation: cc-paw-bat 0.85s ease-in-out infinite;
        }
        .cute-footer-cat[data-mood="play"] .cc-tail,
        .cute-footer-cat[data-mood="play"] .cc-tail-outline {
          animation: cc-tail-excited 0.6s ease-in-out infinite;
        }
        @keyframes cc-yarn-roll {
          0%,
          100% {
            transform: scale(1) rotate(0deg) translateY(0);
          }
          50% {
            transform: scale(1) rotate(14deg) translateY(-2px);
          }
        }
        @keyframes cc-paw-bat {
          0%,
          100% {
            transform: rotate(0deg) translate(0, 0);
          }
          50% {
            transform: rotate(-22deg) translate(-3px, -4px);
          }
        }
        @keyframes cc-tail-excited {
          0%,
          100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        .cute-footer-cat[data-mood="stretch"] .cc-body {
          animation: cc-stretch-body 2.5s ease-in-out 1;
        }
        .cute-footer-cat[data-mood="stretch"] .cc-tail,
        .cute-footer-cat[data-mood="stretch"] .cc-tail-outline {
          animation: cc-tail-up 2.5s ease-in-out 1;
        }
        .cute-footer-cat[data-mood="stretch"] .cc-head {
          animation: cc-stretch-head 2.5s ease-in-out 1;
        }
        @keyframes cc-stretch-body {
          0%,
          100% {
            transform: scale(1, 1);
          }
          40%,
          70% {
            transform: scale(1.12, 0.86) translateY(4px);
          }
        }
        @keyframes cc-stretch-head {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          40%,
          70% {
            transform: translateY(6px) scale(0.95);
          }
        }
        @keyframes cc-tail-up {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-24deg);
          }
        }

        .cute-footer-cat[data-mood="groom"] .cc-paw-left {
          animation: cc-paw-wash 1.9s ease-in-out infinite;
        }
        .cute-footer-cat[data-mood="groom"] .cc-eye-left .cc-lid,
        .cute-footer-cat[data-mood="groom"] .cc-eye-right .cc-lid {
          animation: cc-eyes-content 1.9s ease-in-out infinite;
        }
        @keyframes cc-paw-wash {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-4px, -20px) rotate(-18deg);
          }
          60% {
            transform: translate(2px, -14px) rotate(6deg);
          }
        }
        @keyframes cc-eyes-content {
          0%,
          100% {
            transform: scaleY(0.15);
          }
        }

        .cute-footer-cat[data-mood="wink"] .cc-eye-right .cc-lid {
          animation: cc-wink 1.5s ease-in-out 1;
        }
        .cute-footer-cat[data-mood="wink"] .cc-sparkle-a {
          animation: cc-sparkle-pop 1.5s ease-out 1;
        }
        @keyframes cc-wink {
          0%,
          20%,
          100% {
            transform: scaleY(0);
          }
          35%,
          75% {
            transform: scaleY(1);
          }
        }
        @keyframes cc-sparkle-pop {
          0%,
          30% {
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(20deg);
          }
          80%,
          100% {
            opacity: 0;
            transform: scale(0.6) rotate(30deg);
          }
        }

        .cute-footer-cat[data-mood="look"] .cc-head {
          animation: cc-look-around 2.8s ease-in-out 1;
        }
        @keyframes cc-look-around {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-9deg);
          }
          65% {
            transform: rotate(10deg);
          }
        }

        .cute-footer-cat[data-mood="lie"] .cc-cat {
          animation: cc-lie-down 4.5s ease-in-out 1;
        }
        .cute-footer-cat[data-mood="lie"] .cc-tail,
        .cute-footer-cat[data-mood="lie"] .cc-tail-outline {
          animation: cc-tail-idle 4s ease-in-out infinite;
        }
        @keyframes cc-lie-down {
          0% {
            transform: translateY(0) scaleY(1);
          }
          18%,
          82% {
            transform: translateY(14px) scaleY(0.72);
          }
          100% {
            transform: translateY(0) scaleY(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-body,
          .cc-tail,
          .cc-tail-outline,
          .cc-eye-left .cc-lid,
          .cc-eye-right .cc-lid,
          .cc-stage {
            animation: none !important;
            transition: none !important;
          }
          .cute-footer-cat [class*="cc-"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
