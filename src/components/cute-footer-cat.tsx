"use client";

import { useEffect, useRef } from "react";

const SPRITE_SIZE = 32;
const SPEED = 10;
const FOOTER_PADDING = 16;
const SPRITE_URL = "https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif";

const SPRITES = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
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

type Point = { x: number; y: number };

export function CuteFooterCat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = ref.current;
    const footer = cat?.closest("footer");
    if (!cat || !footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let frameCount = 0;
    let lastFrameTimestamp = 0;
    let mouse: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let catPosition: Point | null = null;

    const getBounds = () => {
      const rect = footer.getBoundingClientRect();
      const minX = rect.left + FOOTER_PADDING + SPRITE_SIZE / 2;
      const maxX = Math.max(minX, rect.right - FOOTER_PADDING - SPRITE_SIZE / 2);
      const minY = rect.top + FOOTER_PADDING + SPRITE_SIZE / 2;
      const maxY = Math.max(minY, rect.bottom - FOOTER_PADDING - SPRITE_SIZE / 2);
      return { rect, minX, maxX, minY, maxY };
    };

    const clampToFooter = (point: Point): Point => {
      const { minX, maxX, minY, maxY } = getBounds();
      return {
        x: Math.min(Math.max(point.x, minX), maxX),
        y: Math.min(Math.max(point.y, minY), maxY),
      };
    };

    const setSprite = (name: SpriteName, frame: number) => {
      const sprite = SPRITES[name][frame % SPRITES[name].length];
      cat.style.backgroundPosition = `${sprite[0] * SPRITE_SIZE}px ${sprite[1] * SPRITE_SIZE}px`;
    };

    const placeCat = (position: Point) => {
      const { rect } = getBounds();
      cat.style.transform = `translate3d(${position.x - rect.left - SPRITE_SIZE / 2}px, ${position.y - rect.top - SPRITE_SIZE / 2}px, 0)`;
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse = { x: event.clientX, y: event.clientY };
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

      const { minX, maxX, minY, maxY } = getBounds();
      const target = clampToFooter(mouse);

      if (!catPosition) {
        catPosition = {
          x: Math.min(Math.max(target.x, minX), maxX),
          y: maxY,
        };
      }

      if (reducedMotion.matches) {
        setSprite("idle", 0);
        placeCat(catPosition);
        animationFrame = window.requestAnimationFrame(onAnimationFrame);
        return;
      }

      const diffX = catPosition.x - target.x;
      const diffY = catPosition.y - target.y;
      const distance = Math.hypot(diffX, diffY);

      if (distance < SPEED || distance < 48) {
        setSprite("idle", 0);
      } else {
        const normalizedX = diffX / distance;
        const normalizedY = diffY / distance;
        let direction = "";
        direction += normalizedY > 0.5 ? "N" : "";
        direction += normalizedY < -0.5 ? "S" : "";
        direction += normalizedX > 0.5 ? "W" : "";
        direction += normalizedX < -0.5 ? "E" : "";

        setSprite(direction as SpriteName, frameCount);
        catPosition = {
          x: catPosition.x - normalizedX * SPEED,
          y: catPosition.y - normalizedY * SPEED,
        };
      }

      catPosition = {
        x: Math.min(Math.max(catPosition.x, minX), maxX),
        y: Math.min(Math.max(catPosition.y, minY), maxY),
      };
      placeCat(catPosition);
      animationFrame = window.requestAnimationFrame(onAnimationFrame);
    };

    cat.style.backgroundImage = `url(${SPRITE_URL})`;
    cat.style.backgroundRepeat = "no-repeat";
    cat.style.backgroundSize = "256px 128px";
    cat.style.backgroundPosition = "-96px -96px";
    cat.style.imageRendering = "pixelated";
    cat.style.display = "block";

    window.addEventListener("mousemove", onMouseMove, { passive: true });
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
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        willChange: "transform, background-position",
      }}
    />
  );
}
