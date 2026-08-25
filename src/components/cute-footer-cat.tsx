"use client";

import { useEffect, useRef } from "react";

const CAT_WIDTH = 170;
const CAT_HEIGHT = 113;
const EDGE_GAP = 18;
const FOLLOW_DISTANCE = 110;

export function CuteFooterCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0, active: false });
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const footer = catRef.current?.closest("footer");
    if (!footer || !catRef.current) return;

    const cat = catRef.current;
    let frame = 0;
    let lastTime = performance.now();

    const setRestTarget = () => {
      const rect = footer.getBoundingClientRect();
      targetRef.current = {
        x: Math.max(EDGE_GAP, rect.width - CAT_WIDTH - EDGE_GAP),
        y: Math.max(EDGE_GAP, rect.height - CAT_HEIGHT - EDGE_GAP),
        active: false,
      };
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = footer.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        targetRef.current.active = false;
        return;
      }

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const catCenterX = positionRef.current.x + CAT_WIDTH / 2;
      const catCenterY = positionRef.current.y + CAT_HEIGHT / 2;
      const dx = catCenterX - localX;
      const dy = catCenterY - localY;
      const distance = Math.hypot(dx, dy) || 1;
      const desiredDistance = FOLLOW_DISTANCE;
      const scale = Math.max(0, distance - desiredDistance) / distance;

      targetRef.current = {
        x: localX + dx * scale - CAT_WIDTH / 2,
        y: localY + dy * scale - CAT_HEIGHT / 2,
        active: true,
      };
    };

    const animate = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      const rect = footer.getBoundingClientRect();
      const maxX = Math.max(EDGE_GAP, rect.width - CAT_WIDTH - EDGE_GAP);
      const maxY = Math.max(EDGE_GAP, rect.height - CAT_HEIGHT - EDGE_GAP);
      const target = targetRef.current;
      const current = positionRef.current;
      const velocity = velocityRef.current;
      const spring = target.active ? 0.0018 : 0.0012;
      const damping = 0.88;
      velocity.x = velocity.x * damping + (target.x - current.x) * spring * dt;
      velocity.y = velocity.y * damping + (target.y - current.y) * spring * dt;
      current.x = Math.min(maxX, Math.max(EDGE_GAP, current.x + velocity.x * dt));
      current.y = Math.min(maxY, Math.max(EDGE_GAP, current.y + velocity.y * dt));

      const idleX = Math.sin(now / 1700) * 5;
      const idleY = Math.sin(now / 950) * 3;
      cat.style.transform = `translate3d(${current.x + idleX}px, ${current.y + idleY}px, 0)`;
      frame = requestAnimationFrame(animate);
    };

    setRestTarget();
    const initialRect = footer.getBoundingClientRect();
    positionRef.current = { x: Math.max(EDGE_GAP, initialRect.width - CAT_WIDTH - EDGE_GAP), y: Math.max(EDGE_GAP, initialRect.height - CAT_HEIGHT - EDGE_GAP) };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("resize", setRestTarget);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("resize", setRestTarget);
    };
  }, []);

  return (
    <div
      ref={catRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 z-10 select-none motion-reduce:hidden"
      style={{ width: CAT_WIDTH, height: CAT_HEIGHT, willChange: "transform" }}
    >
      <img
        src="/cat-footer-reference.svg"
        alt=""
        width={385}
        height={255}
        draggable={false}
        className="h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
      />
    </div>
  );
}
