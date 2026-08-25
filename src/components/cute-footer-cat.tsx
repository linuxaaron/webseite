"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mood = "sit" | "play" | "stretch" | "groom" | "wink" | "look" | "lie";

const MOODS: Mood[] = ["sit", "play", "stretch", "groom", "wink", "look", "lie"];

// Faster, more varied animation cycle so the cat visibly changes pose often.
const MOOD_DURATION: Record<Mood, number> = {
  sit: 1500,
  play: 1800,
  stretch: 1100,
  groom: 1400,
  wink: 700,
  look: 900,
  lie: 1700,
};

const IDLE_ONLY: Mood[] = ["stretch", "lie", "groom"];
const EDGE_GAP = 8;
const OBSTACLE_PADDING = 10;
const FOLLOW_RADIUS = 58;
const TOUCH_LOOK_MS = 900;
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

    const resolveCollisions = (x: number, y: number, w: number, h: number) => {
      let rx = x;
      let ry = y;
      for (const o of obstacles.current) {
        const overlapX = Math.min(rx + w, o.right) - Math.max(rx, o.left);
        const overlapY = Math.min(ry + h, o.bottom) - Math.max(ry, o.top);
        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
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
        }
      } else if (touchLook.current && now < touchLook.current.until) {
        chasing = true;
        targetX += (touchLook.current.x - (pos.current.x + w / 2)) * 0.2;
        targetY += (touchLook.current.y - (pos.current.y + h / 2)) * 0.2;
      } else {
        touchLook.current = null;
        if (!reduced) {
          // More noticeable idle wandering instead of sitting completely still.
          const t = now / 1000;
          targetX = b.maxX - (Math.sin(t * 0.8) * 0.5 + 0.5) * Math.min(70, b.rect.width * 0.16);
          targetY = b.maxY - Math.abs(Math.sin(t * 1.25)) * 12;
        }
      }

      restingRef.current = !chasing;
      targetX = Math.min(b.maxX, Math.max(b.minX, targetX));
      targetY = Math.min(b.maxY, Math.max(b.minY, targetY));

      const ease = reduced ? 1 : chasing ? 0.075 : 0.055;
      const prevX = pos.current.x;
      const prevY = pos.current.y;
      pos.current.x += (targetX - pos.current.x) * ease;
      pos.current.y += (targetY - pos.current.y) * ease;

      const resolved = resolveCollisions(pos.current.x, pos.current.y, w, h);
      pos.current.x = Math.min(b.maxX, Math.max(b.minX, resolved.x));
      pos.current.y = Math.min(b.maxY, Math.max(b.minY, resolved.y));

      const vx = pos.current.x - prevX;
      const vy = pos.current.y - prevY;
      if (now - lastFacingFlip > 160 && Math.abs(vx) > 0.12) {
        lastFacingFlip = now;
        setFacing(vx < 0 ? "left" : "right");
      }

      // Slight continuous body bounce adds motion between the main poses.
      const bob = reduced ? 0 : Math.sin(now / 260) * 2.4 + Math.sin(now / 97) * 0.7;
      const tilt = reduced ? 0 : Math.max(-3, Math.min(3, vx * 3 + vy * 0.5));
      cat.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y + bob}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };

    home();
    recomputeObstacles();
    const onResize = () => recomputeObstacles();
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
      style={{ width: "clamp(82px, 10vw, 125px)", height: "clamp(72px, 8.5vw, 108px)", willChange: "transform" }}
    >
      <div className="cc-stage">
        <svg viewBox="0 0 220 190" className="cc-svg" role="img" aria-hidden="true">
          <ellipse className="cc-shadow" cx="112" cy="172" rx="46" ry="7" />
          <g className="cc-cat">
            <path className="cc-tail-outline" d="M150,158 C176,160 194,146 196,122 C197,106 188,94 176,96 C167,98 165,108 173,112" />
            <path className="cc-tail" d="M150,158 C176,160 194,146 196,122 C197,106 188,94 176,96 C167,98 165,108 173,112" />
            <g className="cc-yarn">
              <path className="cc-yarn-string" d="M108,165 C130,178 150,180 156,168" />
              <circle className="cc-yarn-ball" cx="168" cy="163" r="13" />
              <path className="cc-yarn-texture" d="M158,158 C166,166 172,166 178,159 M157,164 C166,170 172,168 179,164 M160,170 C167,173 173,171 177,168" />
            </g>
            <path className="cc-body" d="M112,86 C146,86 166,112 166,142 C166,164 141,176 112,176 C83,176 58,164 58,142 C58,112 78,86 112,86 Z" />
            <g className="cc-paw cc-paw-left"><ellipse cx="90" cy="170" rx="13" ry="10" /></g>
            <g className="cc-paw cc-paw-right"><ellipse cx="134" cy="170" rx="13" ry="10" /></g>
            <g className="cc-head">
              <path className="cc-ear cc-ear-left" d="M74,52 L64,16 L104,42 Z" />
              <path className="cc-ear-inner cc-ear-left" d="M80,48 L74,24 L98,40 Z" />
              <path className="cc-ear cc-ear-right" d="M150,52 L160,16 L120,42 Z" />
              <path className="cc-ear-inner cc-ear-right" d="M144,48 L150,24 L126,40 Z" />
              <circle className="cc-face" cx="112" cy="76" r="42" />
              <ellipse className="cc-blush" cx="84" cy="88" rx="9" ry="5" />
              <ellipse className="cc-blush" cx="140" cy="88" rx="9" ry="5" />
              <g className="cc-eye cc-eye-left"><ellipse className="cc-iris" cx="94" cy="74" rx="8.5" ry="10" /><ellipse className="cc-pupil" cx="94" cy="75" rx="3" ry="6" /></g>
              <g className="cc-eye cc-eye-right"><ellipse className="cc-iris" cx="130" cy="74" rx="8.5" ry="10" /><ellipse className="cc-pupil" cx="130" cy="75" rx="3" ry="6" /></g>
              <path className="cc-nose" d="M108,88 Q112,92 116,88 Q112,96 108,88 Z" />
              <path className="cc-mouth" d="M112,95 Q106,101 101,96 M112,95 Q118,101 123,96" />
              <path className="cc-whiskers" d="M82,96 L54,91 M82,102 L52,103 M142,96 L170,91 M142,102 L172,103" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
