"use client";

import { useEffect, useRef } from "react";

const EDGE_GAP = 18;
const FOLLOW_DISTANCE = 110;
const MAX_WIDTH = 150;
const MOBILE_WIDTH = 118;
const ASPECT_RATIO = 1.5;

export function CuteFooterCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0, active: false });
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cat = catRef.current;
    const footer = cat?.closest("footer");
    if (!cat || !footer) return;

    let frame = 0;
    let lastTime = performance.now();

    const dimensions = () => {
      const width = Math.min(MAX_WIDTH, Math.max(MOBILE_WIDTH, window.innerWidth * 0.14));
      const height = width / ASPECT_RATIO;
      cat.style.width = `${width}px`;
      cat.style.height = `${height}px`;
      return { width, height };
    };

    const clamp = (x: number, y: number, fw: number, fh: number, cw: number, ch: number) => ({
      x: Math.min(Math.max(EDGE_GAP, x), Math.max(EDGE_GAP, fw - cw - EDGE_GAP)),
      y: Math.min(Math.max(EDGE_GAP, y), Math.max(EDGE_GAP, fh - ch - EDGE_GAP)),
    });

    const setRestTarget = () => {
      const { width, height } = dimensions();
      const rect = footer.getBoundingClientRect();
      targetRef.current = { ...clamp(rect.width - width - EDGE_GAP, rect.height - height - EDGE_GAP, rect.width, rect.height, width, height), active: false };
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = footer.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        targetRef.current.active = false;
        return;
      }

      const cw = cat.offsetWidth;
      const ch = cat.offsetHeight;
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const cx = positionRef.current.x + cw / 2;
      const cy = positionRef.current.y + ch / 2;
      const dx = cx - px;
      const dy = cy - py;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance <= FOLLOW_DISTANCE) {
        targetRef.current = { ...positionRef.current, active: true };
        return;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      const target = clamp(px + nx * FOLLOW_DISTANCE - cw / 2, py + ny * FOLLOW_DISTANCE - ch / 2, rect.width, rect.height, cw, ch);
      targetRef.current = { ...target, active: true };
    };

    const resetPointer = () => setRestTarget();

    const animate = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      const rect = footer.getBoundingClientRect();
      const cw = cat.offsetWidth;
      const ch = cat.offsetHeight;
      const maxX = Math.max(EDGE_GAP, rect.width - cw - EDGE_GAP);
      const maxY = Math.max(EDGE_GAP, rect.height - ch - EDGE_GAP);
      const target = targetRef.current;
      const current = positionRef.current;
      const velocity = velocityRef.current;
      const spring = target.active ? 0.0011 : 0.0008;
      const damping = 0.90;

      velocity.x = velocity.x * damping + (target.x - current.x) * spring * dt;
      velocity.y = velocity.y * damping + (target.y - current.y) * spring * dt;
      current.x = Math.min(maxX, Math.max(EDGE_GAP, current.x + velocity.x * dt));
      current.y = Math.min(maxY, Math.max(EDGE_GAP, current.y + velocity.y * dt));

      const idleX = Math.sin(now / 1500) * 4;
      const idleY = Math.sin(now / 900) * 2.5;
      const rotation = Math.sin(now / 2100) * 1.2;
      cat.style.transform = `translate3d(${current.x + idleX}px, ${current.y + idleY}px, 0) rotate(${rotation}deg)`;
      frame = requestAnimationFrame(animate);
    };

    setRestTarget();
    const rect = footer.getBoundingClientRect();
    const width = cat.offsetWidth || MAX_WIDTH;
    const height = cat.offsetHeight || MAX_WIDTH / ASPECT_RATIO;
    positionRef.current = clamp(rect.width - width - EDGE_GAP, rect.height - height - EDGE_GAP, rect.width, rect.height, width, height);

    window.addEventListener("pointermove", updatePointer, { passive: true });
    footer.addEventListener("pointerleave", resetPointer);
    window.addEventListener("resize", setRestTarget);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
      footer.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("resize", setRestTarget);
    };
  }, []);

  return (
    <div ref={catRef} aria-hidden="true" className="cute-footer-cat pointer-events-none absolute bottom-0 right-0 z-50 select-none motion-reduce:hidden" style={{ width: MAX_WIDTH, aspectRatio: `${ASPECT_RATIO}`, willChange: "transform" }}>
      <svg viewBox="0 0 300 200" width="300" height="200" className="h-full w-full overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)]" xmlns="http://www.w3.org/2000/svg">
        <g className="cat-tail"><path d="M252 150c28 10 38-18 25-33-7-8-17-5-18 4 0 8 10 9 13 3" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round"/><path d="M252 150c28 10 38-18 25-33-7-8-17-5-18 4 0 8 10 9 13 3" fill="none" stroke="#d8d8e2" strokeWidth="2" strokeLinecap="round"/></g>
        <ellipse cx="166" cy="151" rx="70" ry="38" fill="#fff" stroke="#d8d8e2" strokeWidth="3"/>
        <ellipse cx="174" cy="172" rx="19" ry="9" fill="#ececf4"/><ellipse cx="122" cy="172" rx="19" ry="9" fill="#ececf4"/>
        <g className="cat-head"><path d="M78 73 82 28l32 25c15-7 35-9 51-3l29-23 7 48c11 14 12 34 4 49-12 22-43 34-72 30-32-4-54-23-57-51-1-11 1-22 2-30Z" fill="#fff" stroke="#d8d8e2" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M88 49 87 37l17 13" fill="#f7a9bc"/><path d="M185 48l12-12 2 18" fill="#f7a9bc"/>
          <ellipse className="cat-blink" cx="119" cy="83" rx="10" ry="14" fill="#4f7cff"/><ellipse className="cat-blink" cx="171" cy="83" rx="10" ry="14" fill="#4f7cff"/>
          <circle cx="121" cy="82" r="4" fill="#111"/><circle cx="173" cy="82" r="4" fill="#111"/><circle cx="118" cy="78" r="2.5" fill="#fff"/><circle cx="170" cy="78" r="2.5" fill="#fff"/>
          <path d="M140 101q9-7 18 0-9 12-18 0Z" fill="#f28fa9"/><path d="M149 107v7" stroke="#777" strokeWidth="2" strokeLinecap="round"/><path d="M136 111q13 9 26 0" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"/>
          <path d="M105 105 73 98M105 112 69 113M190 105 221 98M190 112 224 114" stroke="#9b9bab" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g className="cat-paw"><ellipse cx="106" cy="151" rx="18" ry="13" fill="#fff" stroke="#d8d8e2" strokeWidth="3"/><ellipse cx="211" cy="151" rx="18" ry="13" fill="#fff" stroke="#d8d8e2" strokeWidth="3"/></g>
        <g className="cat-yarn"><circle cx="58" cy="155" r="20" fill="#6f7cff"/><path d="M44 145c12 10 20 13 30 18M43 157c11 4 19 7 29 13M52 137c7 10 13 14 22 18" stroke="#cdd4ff" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M73 151c25-8 31-22 38-35" fill="none" stroke="#6f7cff" strokeWidth="3" strokeLinecap="round"/></g>
      </svg>
      <style jsx>{`
        .cat-tail { transform-origin: 255px 145px; animation: tail 1.9s ease-in-out infinite; }
        .cat-head { transform-origin: 150px 105px; animation: head 2.7s ease-in-out infinite; }
        .cat-paw { transform-origin: 160px 155px; animation: paw 1.6s ease-in-out infinite; }
        .cat-yarn { transform-origin: 58px 155px; animation: yarn 2.2s ease-in-out infinite; }
        .cat-blink { animation: blink 4.2s ease-in-out infinite; }
        @keyframes tail { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(12deg); } }
        @keyframes head { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-2px) rotate(-1deg); } }
        @keyframes paw { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes yarn { 0%,100% { transform: rotate(0); } 50% { transform: rotate(8deg); } }
        @keyframes blink { 0%,44%,48%,100% { transform: scaleY(1); } 46% { transform: scaleY(.08); } }
        @media (prefers-reduced-motion: reduce) { .cat-tail,.cat-head,.cat-paw,.cat-yarn,.cat-blink { animation: none; } }
      `}</style>
    </div>
  );
}
