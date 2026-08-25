"use client";

import { useEffect, useRef } from "react";

const EDGE_GAP = 18;
const FOLLOW_DISTANCE = 110;
const MAX_WIDTH = 145;
const MOBILE_WIDTH = 120;
const ASPECT_RATIO = 385 / 255;

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

    const clampTarget = (x: number, y: number, footerWidth: number, footerHeight: number, catWidth: number, catHeight: number) => ({
      x: Math.min(Math.max(EDGE_GAP, x), Math.max(EDGE_GAP, footerWidth - catWidth - EDGE_GAP)),
      y: Math.min(Math.max(EDGE_GAP, y), Math.max(EDGE_GAP, footerHeight - catHeight - EDGE_GAP)),
    });

    const setRestTarget = () => {
      const { width: catWidth, height: catHeight } = dimensions();
      const rect = footer.getBoundingClientRect();
      const rest = clampTarget(rect.width - catWidth - EDGE_GAP, rect.height - catHeight - EDGE_GAP, rect.width, rect.height, catWidth, catHeight);
      targetRef.current = { ...rest, active: false };
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = footer.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        targetRef.current.active = false;
        return;
      }

      const catWidth = cat.offsetWidth;
      const catHeight = cat.offsetHeight;
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const catCenterX = positionRef.current.x + catWidth / 2;
      const catCenterY = positionRef.current.y + catHeight / 2;
      const dx = catCenterX - pointerX;
      const dy = catCenterY - pointerY;
      const distance = Math.hypot(dx, dy);

      // If the pointer is already within the safety radius, don't pull the cat toward it.
      if (distance <= FOLLOW_DISTANCE) {
        targetRef.current = { ...positionRef.current, active: true };
        return;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      const desiredCenterX = pointerX + nx * FOLLOW_DISTANCE;
      const desiredCenterY = pointerY + ny * FOLLOW_DISTANCE;
      const target = clampTarget(
        desiredCenterX - catWidth / 2,
        desiredCenterY - catHeight / 2,
        rect.width,
        rect.height,
        catWidth,
        catHeight,
      );

      targetRef.current = { ...target, active: true };
    };

    const resetPointer = () => setRestTarget();

    const animate = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      const rect = footer.getBoundingClientRect();
      const catWidth = cat.offsetWidth;
      const catHeight = cat.offsetHeight;
      const target = targetRef.current;
      const current = positionRef.current;
      const velocity = velocityRef.current;
      const bounds = clampTarget(0, 0, rect.width, rect.height, catWidth, catHeight);
      const maxX = Math.max(bounds.x, rect.width - catWidth - EDGE_GAP);
      const maxY = Math.max(bounds.y, rect.height - catHeight - EDGE_GAP);
      const spring = target.active ? 0.0011 : 0.0008;
      const damping = 0.90;

      velocity.x = velocity.x * damping + (target.x - current.x) * spring * dt;
      velocity.y = velocity.y * damping + (target.y - current.y) * spring * dt;
      current.x = Math.min(maxX, Math.max(EDGE_GAP, current.x + velocity.x * dt));
      current.y = Math.min(maxY, Math.max(EDGE_GAP, current.y + velocity.y * dt));

      const idleX = target.active ? Math.sin(now / 1700) * 2 : Math.sin(now / 1500) * 5;
      const idleY = Math.sin(now / 900) * 2.5;
      const idleRotation = Math.sin(now / 2100) * 1.2;
      cat.style.transform = `translate3d(${current.x + idleX}px, ${current.y + idleY}px, 0) rotate(${idleRotation}deg)`;
      frame = requestAnimationFrame(animate);
    };

    setRestTarget();
    const initialRect = footer.getBoundingClientRect();
    const initialWidth = cat.offsetWidth;
    const initialHeight = cat.offsetHeight;
    const initial = clampTarget(initialRect.width - initialWidth - EDGE_GAP, initialRect.height - initialHeight - EDGE_GAP, initialRect.width, initialRect.height, initialWidth, initialHeight);
    positionRef.current = initial;

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
    <div
      ref={catRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 z-10 select-none motion-reduce:hidden"
      style={{ width: MAX_WIDTH, aspectRatio: `${ASPECT_RATIO}`, willChange: "transform" }}
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
