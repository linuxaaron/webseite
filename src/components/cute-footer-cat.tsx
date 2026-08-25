"use client";

import { useEffect, useRef } from "react";

const SPRITE_SIZE = 32;
const SPEED = 5;
const FOOTER_PADDING = 16;
const SPRITE_URL = "https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif";

const SPRITES = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  N: [[-1, -2], [-1, -3]],
  NE: [[0, -2], [0, -3]],
  E: [[-3, 0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S: [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W: [[-4, -2], [-4, -3]],
  NW: [[-1, 0], [-1, -1]],
} as const;

type SpriteName = keyof typeof SPRITES;

export function CuteFooterCat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = ref.current;
    const footer = cat?.closest("footer");
    if (!cat || !footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      cat.hidden = true;
      return;
    }

    let animationFrame = 0;
    let frameCount = 0;
    let lastFrameTimestamp = 0;
    let mouseX = 0;
    let mouseY = 0;
    let catX = 0;
    let catY = 0;
    let initialized = false;

    const setSprite = (name: SpriteName, frame: number) => {
      const sprite = SPRITES[name][frame % SPRITES[name].length];
      cat.style.backgroundPosition = `${sprite[0] * SPRITE_SIZE}px ${sprite[1] * SPRITE_SIZE}px`;
    };

    const getBounds = () => {
      const rect = footer.getBoundingClientRect();
      return {
        left: rect.left + FOOTER_PADDING + SPRITE_SIZE / 2,
        right: Math.max(
          rect.left + FOOTER_PADDING + SPRITE_SIZE / 2,
          rect.right - FOOTER_PADDING - SPRITE_SIZE / 2,
        ),
        top: rect.top + FOOTER_PADDING + SPRITE_SIZE / 2,
        bottom: Math.max(
          rect.top + FOOTER_PADDING + SPRITE_SIZE / 2,
          rect.bottom - FOOTER_PADDING - SPRITE_SIZE / 2,
        ),
      };
    };

    const clampTargetToFooter = () => {
      const bounds = getBounds();
      return {
        x: Math.min(Math.max(mouseX, bounds.left), bounds.right),
        y: Math.min(Math.max(mouseY, bounds.top), bounds.bottom),
      };
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onAnimationFrame = (timestamp: number) => {
      if (!cat.isConnected) return;

      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
      if (timestamp - lastFrameTimestamp < 100) {
        animationFrame = window.requestAnimationFrame(onAnimationFrame);
        return;
      }
      lastFrameTimestamp = timestamp;
      frameCount += 1;

      const target = clampTargetToFooter();
      if (!initialized) {
        catX = target.x;
        catY = target.y;
        initialized = true;
      }

      const diffX = catX - target.x;
      const diffY = catY - target.y;
      const distance = Math.hypot(diffX, diffY);

      if (distance < SPEED || distance < 48) {
        setSprite("idle", 0);
      } else {
        let direction = "";
        const normalizedX = diffX / distance;
        const normalizedY = diffY / distance;

        direction += normalizedY > 0.5 ? "N" : "";
        direction += normalizedY < -0.5 ? "S" : "";
        direction += normalizedX > 0.5 ? "W" : "";
        direction += normalizedX < -0.5 ? "E" : "";

        setSprite(direction as SpriteName, frameCount);
        catX -= normalizedX * SPEED;
        catY -= normalizedY * SPEED;
      }

      const bounds = getBounds();
      catX = Math.min(Math.max(catX, bounds.left), bounds.right);
      catY = Math.min(Math.max(catY, bounds.top), bounds.bottom);

      const footerRect = footer.getBoundingClientRect();
      const localX = catX - footerRect.left - SPRITE_SIZE / 2;
      const localY = catY - footerRect.top - SPRITE_SIZE / 2;

      cat.style.transform = `translate3d(${localX}px, ${localY}px, 0)`;
      animationFrame = window.requestAnimationFrame(onAnimationFrame);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    setSprite("idle", 0);
    animationFrame = window.requestAnimationFrame(onAnimationFrame);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[60] h-8 w-8 select-none"
      style={{
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        willChange: "transform, background-position",
      }}
    />
  );
}
