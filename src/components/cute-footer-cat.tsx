"use client";

import { useEffect, useRef, useState } from "react";

const CAT_WIDTH = 385;
const CAT_HEIGHT = 255;
const MOBILE_CAT_WIDTH = 250;
const MOBILE_CAT_HEIGHT = 166;
const EDGE_PADDING = 12;
const FOLLOW_DISTANCE = 145;
const FOLLOW_LERP = 0.045;
const MAX_FOLLOW_STEP = 3.2;

export function CuteFooterCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const touchDeviceRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const cat = catRef.current;
    if (!footer || !cat) return;

    touchDeviceRef.current = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;

    const setCatVisible = (value: boolean) => setVisible(value);

    const getSize = () => touchDeviceRef.current
      ? { width: MOBILE_CAT_WIDTH, height: MOBILE_CAT_HEIGHT }
      : { width: CAT_WIDTH, height: CAT_HEIGHT };

    const getRestingPosition = () => {
      const rect = footer.getBoundingClientRect();
      const { width, height } = getSize();
      return {
        x: Math.max(EDGE_PADDING, rect.left + (rect.width - width) / 2),
        y: Math.max(EDGE_PADDING, rect.bottom - height - 8),
      };
    };

    const setPosition = (x: number, y: number) => {
      positionRef.current = { x, y };
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;
    };

    const getFooterBounds = () => {
      const rect = footer.getBoundingClientRect();
      const { width, height } = getSize();
      return {
        minX: Math.max(EDGE_PADDING, rect.left + EDGE_PADDING),
        maxX: Math.min(window.innerWidth - width - EDGE_PADDING, rect.right - width - EDGE_PADDING),
        minY: Math.max(EDGE_PADDING, rect.top + EDGE_PADDING),
        maxY: Math.min(window.innerHeight - height - EDGE_PADDING, rect.bottom - height - EDGE_PADDING),
      };
    };

    const updateFollowTarget = () => {
      const pointer = pointerRef.current;
      if (!pointer.inside || touchDeviceRef.current || reducedMotionRef.current) return;

      const { width, height } = getSize();
      const current = positionRef.current;
      const dx = current.x + width / 2 - pointer.x;
      const dy = current.y + height / 2 - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      const bounds = getFooterBounds();

      // The cat follows the cursor while keeping a clear, natural distance.
      const targetX = pointer.x + (dx / distance) * FOLLOW_DISTANCE - width / 2;
      const targetY = pointer.y + (dy / distance) * FOLLOW_DISTANCE - height / 2;

      targetRef.current = {
        x: Math.min(Math.max(targetX, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(targetY, bounds.minY), bounds.maxY),
      };
      activeRef.current = true;
      setCatVisible(true);
    };

    const animate = () => {
      const current = positionRef.current;
      const target = targetRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.hypot(dx, dy);

      if (activeRef.current && !touchDeviceRef.current && !reducedMotionRef.current) {
        const stepX = Math.min(Math.max(dx * FOLLOW_LERP, -MAX_FOLLOW_STEP), MAX_FOLLOW_STEP);
        const stepY = Math.min(Math.max(dy * FOLLOW_LERP, -MAX_FOLLOW_STEP), MAX_FOLLOW_STEP);
        setPosition(current.x + stepX, current.y + stepY);
        cat.style.setProperty("--cat-direction", dx < -1 ? "-1" : "1");
        cat.classList.toggle("is-walking", distance > 10);
      } else {
        cat.classList.remove("is-walking");
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const enterFooter = (event: PointerEvent) => {
      if (touchDeviceRef.current) return;
      pointerRef.current = { x: event.clientX, y: event.clientY, inside: true };
      updateFollowTarget();
    };

    const moveInFooter = (event: PointerEvent) => {
      if (touchDeviceRef.current) return;
      pointerRef.current = { x: event.clientX, y: event.clientY, inside: true };
      updateFollowTarget();
    };

    const leaveFooter = () => {
      if (touchDeviceRef.current) return;
      pointerRef.current.inside = false;
      activeRef.current = false;
      targetRef.current = getRestingPosition();
    };

    const updateMobile = () => {
      if (!touchDeviceRef.current) return;
      const rect = footer.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      setCatVisible(inViewport);
      if (inViewport) {
        const resting = getRestingPosition();
        setPosition(resting.x, resting.y);
        targetRef.current = resting;
      }
    };

    const handleResize = () => {
      if (touchDeviceRef.current) updateMobile();
      else if (pointerRef.current.inside) updateFollowTarget();
      else setPosition(getRestingPosition().x, getRestingPosition().y);
    };

    const observer = new IntersectionObserver(([entry]) => {
      setCatVisible(entry.isIntersecting);
      if (touchDeviceRef.current && entry.isIntersecting) updateMobile();
    }, { threshold: 0.05 });

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      activeRef.current = false;
      setPosition(getRestingPosition().x, getRestingPosition().y);
      cat.classList.remove("is-walking");
    };

    observer.observe(footer);
    footer.addEventListener("pointerenter", enterFooter, { passive: true });
    footer.addEventListener("pointermove", moveInFooter, { passive: true });
    footer.addEventListener("pointerleave", leaveFooter, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", updateMobile, { passive: true });
    reducedMotion.addEventListener("change", handleReducedMotion);

    const initial = getRestingPosition();
    setPosition(initial.x, initial.y);
    targetRef.current = initial;
    setCatVisible(true);
    if (touchDeviceRef.current) updateMobile();
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      footer.removeEventListener("pointerenter", enterFooter);
      footer.removeEventListener("pointermove", moveInFooter);
      footer.removeEventListener("pointerleave", leaveFooter);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateMobile);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={catRef}
      aria-hidden="true"
      className={`cute-footer-cat ${visible ? "is-visible" : ""}`}
    >
      <img src="/cat-footer-reference.svg" alt="" width={CAT_WIDTH} height={CAT_HEIGHT} draggable={false} />
      <style>{`
        .cute-footer-cat {
          position: fixed;
          left: 0;
          top: 0;
          width: ${CAT_WIDTH}px;
          height: ${CAT_HEIGHT}px;
          z-index: 40;
          pointer-events: none !important;
          opacity: 0;
          transform: translate3d(0,0,0) scale(.96) scaleX(var(--cat-direction, 1));
          transform-origin: center bottom;
          transition: opacity .25s ease;
          will-change: left, top, transform;
        }
        .cute-footer-cat.is-visible { opacity: 1; }
        .cute-footer-cat img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
        }
        .cute-footer-cat.is-walking img {
          animation: cat-float .75s ease-in-out infinite alternate;
        }
        @keyframes cat-float {
          from { transform: translateY(0) rotate(-.5deg); }
          to { transform: translateY(-3px) rotate(.5deg); }
        }
        @media (max-width: 640px) {
          .cute-footer-cat { width: ${MOBILE_CAT_WIDTH}px; height: ${MOBILE_CAT_HEIGHT}px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cute-footer-cat, .cute-footer-cat.is-walking img { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
