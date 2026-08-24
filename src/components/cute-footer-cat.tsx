"use client";

import { useEffect, useRef, useState } from "react";

const CAT_WIDTH = 82;
const CAT_HEIGHT = 74;
const MOBILE_CAT_WIDTH = 68;
const MOBILE_CAT_HEIGHT = 62;
const EDGE_PADDING = 18;
const MOBILE_EDGE_PADDING = 8;
const FOLLOW_DISTANCE = 112;
const FOLLOW_LERP = 0.055;
const MAX_FOLLOW_STEP = 2.8;

const POSES = ["sit", "play", "stretch", "groom", "wink", "look"] as const;
type CatPose = (typeof POSES)[number];

const POSE_DURATIONS: Record<CatPose, number> = {
  sit: 1500,
  play: 1300,
  stretch: 1200,
  groom: 1350,
  wink: 1050,
  look: 1200,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CuteFooterCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const touchDeviceRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [pose, setPose] = useState<CatPose>("sit");

  useEffect(() => {
    if (reducedMotionRef.current) return;
    const currentIndex = POSES.indexOf(pose);
    const nextPose = POSES[(currentIndex + 1) % POSES.length];
    const timer = window.setTimeout(() => setPose(nextPose), POSE_DURATIONS[pose]);
    return () => window.clearTimeout(timer);
  }, [pose]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const cat = catRef.current;
    if (!footer || !cat) return;

    touchDeviceRef.current = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;

    const setCatVisible = (value: boolean) => {
      visibleRef.current = value;
      setVisible(value);
    };

    const getRestingPosition = () => {
      if (touchDeviceRef.current) {
        return {
          x: Math.max(MOBILE_EDGE_PADDING, window.innerWidth - MOBILE_CAT_WIDTH - MOBILE_EDGE_PADDING),
          y: Math.max(MOBILE_EDGE_PADDING, window.innerHeight - MOBILE_CAT_HEIGHT - MOBILE_EDGE_PADDING),
        };
      }

      const rect = footer.getBoundingClientRect();
      return {
        x: clamp(rect.right - CAT_WIDTH - EDGE_PADDING, EDGE_PADDING, window.innerWidth - CAT_WIDTH - EDGE_PADDING),
        y: clamp(rect.bottom - CAT_HEIGHT - EDGE_PADDING, EDGE_PADDING, window.innerHeight - CAT_HEIGHT - EDGE_PADDING),
      };
    };

    const setPosition = (x: number, y: number) => {
      positionRef.current = { x, y };
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;
    };

    const getFooterBounds = () => {
      const rect = footer.getBoundingClientRect();
      return {
        minX: Math.max(EDGE_PADDING, rect.left + EDGE_PADDING),
        maxX: Math.min(window.innerWidth - CAT_WIDTH - EDGE_PADDING, rect.right - CAT_WIDTH - EDGE_PADDING),
        minY: Math.max(EDGE_PADDING, rect.top + EDGE_PADDING),
        maxY: Math.min(window.innerHeight - CAT_HEIGHT - EDGE_PADDING, rect.bottom - CAT_HEIGHT - EDGE_PADDING),
      };
    };

    const updateFollowTarget = () => {
      const pointer = pointerRef.current;
      if (!pointer.inside || touchDeviceRef.current) return;

      const current = positionRef.current;
      const dx = current.x + CAT_WIDTH / 2 - pointer.x;
      const dy = current.y + CAT_HEIGHT / 2 - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      const bounds = getFooterBounds();

      // The target stays behind the cursor instead of sitting on top of it.
      const targetX = pointer.x + (dx / distance) * FOLLOW_DISTANCE - CAT_WIDTH / 2;
      const targetY = pointer.y + (dy / distance) * FOLLOW_DISTANCE - CAT_HEIGHT / 2;

      targetRef.current = {
        x: clamp(targetX, bounds.minX, bounds.maxX),
        y: clamp(targetY, bounds.minY, bounds.maxY),
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
        const stepX = clamp(dx * FOLLOW_LERP, -MAX_FOLLOW_STEP, MAX_FOLLOW_STEP);
        const stepY = clamp(dy * FOLLOW_LERP, -MAX_FOLLOW_STEP, MAX_FOLLOW_STEP);
        setPosition(current.x + stepX, current.y + stepY);
        cat.style.setProperty("--walk-direction", dx < -1 ? "-1" : "1");
        cat.classList.toggle("cute-cat-walk", distance > 7);
      } else {
        cat.classList.remove("cute-cat-walk");
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const moveToCursor = (event: PointerEvent) => {
      if (touchDeviceRef.current) return;
      pointerRef.current = { x: event.clientX, y: event.clientY, inside: true };
      updateFollowTarget();
    };

    const enterFooter = (event: PointerEvent) => {
      if (touchDeviceRef.current) return;
      pointerRef.current = { x: event.clientX, y: event.clientY, inside: true };
      // Do not teleport the cat when the cursor enters the footer.
      // It keeps its current position and begins following smoothly.
      if (!activeRef.current) {
        updateFollowTarget();
      }
    };

    const leaveFooter = () => {
      if (touchDeviceRef.current) return;
      pointerRef.current.inside = false;
      activeRef.current = false;
      targetRef.current = getRestingPosition();
    };

    const updateMobileCat = () => {
      if (!touchDeviceRef.current) return;
      const rect = footer.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inViewport) {
        const resting = getRestingPosition();
        setPosition(resting.x, resting.y);
        targetRef.current = resting;
        setCatVisible(true);
      } else {
        setCatVisible(false);
      }
    };

    const handleResize = () => {
      if (touchDeviceRef.current) {
        updateMobileCat();
        return;
      }
      if (pointerRef.current.inside) updateFollowTarget();
      else if (!activeRef.current) setPosition(getRestingPosition().x, getRestingPosition().y);
    };

    const observer = new IntersectionObserver(([entry]) => {
      setCatVisible(entry.isIntersecting);
      if (touchDeviceRef.current && entry.isIntersecting) updateMobileCat();
    }, { threshold: 0.05 });

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (event.matches) {
        activeRef.current = false;
        setPose("sit");
        setPosition(getRestingPosition().x, getRestingPosition().y);
      }
    };

    observer.observe(footer);
    footer.addEventListener("pointerenter", enterFooter, { passive: true });
    footer.addEventListener("pointermove", moveToCursor, { passive: true });
    footer.addEventListener("pointerleave", leaveFooter, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", updateMobileCat, { passive: true });
    reducedMotion.addEventListener("change", handleReducedMotion);

    const initial = getRestingPosition();
    setPosition(initial.x, initial.y);
    targetRef.current = initial;
    if (touchDeviceRef.current) updateMobileCat();
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      footer.removeEventListener("pointerenter", enterFooter);
      footer.removeEventListener("pointermove", moveToCursor);
      footer.removeEventListener("pointerleave", leaveFooter);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateMobileCat);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={catRef}
      aria-hidden="true"
      className={`cute-footer-cat ${visible ? "is-visible" : ""} cute-cat-pose-${pose}`}
    >
      <svg viewBox="0 0 82 74" width="82" height="74" role="presentation">
        <defs>
          <filter id="cat-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
          </filter>
          <linearGradient id="cat-fur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e8edf3" />
          </linearGradient>
        </defs>

        <g className="cute-cat-art" filter="url(#cat-shadow)">
          <path className="cute-cat-tail" d="M63 55 C76 56 79 44 72 37 C68 33 64 37 67 41 C72 47 67 50 61 48" fill="none" stroke="#f7f9fc" strokeWidth="7" strokeLinecap="round" />
          <g className="cute-cat-body">
            <ellipse cx="42" cy="52" rx="22" ry="15" fill="url(#cat-fur)" />
            <ellipse cx="45" cy="58" rx="12" ry="7" fill="#dce3eb" opacity=".55" />
            <g className="cute-cat-paw cute-cat-paw-left">
              <ellipse cx="29" cy="61" rx="6" ry="4.3" fill="#fff" />
              <circle cx="27" cy="61" r="1" fill="#c7d0da" />
              <circle cx="30" cy="61.8" r="1" fill="#c7d0da" />
            </g>
            <g className="cute-cat-paw cute-cat-paw-right">
              <ellipse cx="52" cy="61" rx="6" ry="4.3" fill="#fff" />
              <circle cx="50" cy="61" r="1" fill="#c7d0da" />
              <circle cx="53" cy="61.8" r="1" fill="#c7d0da" />
            </g>

            <g className="cute-cat-head">
              <path d="M22 34 L24 13 L36 23 C40 20 44 20 48 23 L60 13 L61 35 C61 48 53 54 42 54 C30 54 22 47 22 34Z" fill="url(#cat-fur)" />
              <path d="M26 25 L26 18 L34 24 C31 24 29 24 26 25Z" fill="#f3a7b8" />
              <path d="M57 25 L58 18 L50 24 C53 24 55 24 57 25Z" fill="#f3a7b8" />

              <g className="cute-cat-eyes">
                <ellipse className="cute-cat-eye cute-cat-eye-left" cx="33" cy="34" rx="7" ry="8.5" fill="#6cc5ff" />
                <ellipse className="cute-cat-eye cute-cat-eye-right" cx="51" cy="34" rx="7" ry="8.5" fill="#6cc5ff" />
                <ellipse cx="33" cy="35" rx="2.5" ry="4.8" fill="#152338" />
                <ellipse cx="51" cy="35" rx="2.5" ry="4.8" fill="#152338" />
                <circle cx="31" cy="31" r="1.9" fill="#fff" />
                <circle cx="49" cy="31" r="1.9" fill="#fff" />
              </g>

              <path className="cute-cat-wink" d="M47 35 Q51 31 55 35" fill="none" stroke="#243247" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M38.5 40 Q42 43 45.5 40" fill="none" stroke="#596579" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M40.5 39.5 Q42 38 43.5 39.5 Q42 42 40.5 39.5Z" fill="#e98ea3" />
              <path d="M28 39 L18 37 M28 42 L17 43 M56 39 L66 37 M56 42 L67 43" stroke="#b7c0ca" strokeWidth="1" strokeLinecap="round" />
            </g>
          </g>

          <g className="cute-cat-yarn">
            <circle cx="16" cy="61" r="7" fill="#79c8ff" />
            <path d="M11 59 C14 56 19 57 21 60 C18 63 14 64 11 62 C14 60 17 60 20 62" fill="none" stroke="#d9f1ff" strokeWidth="1" opacity=".9" />
            <path d="M21 63 C26 67 30 66 33 62" fill="none" stroke="#79c8ff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      <style>{`
        .cute-footer-cat {
          position: fixed;
          left: 0;
          top: 0;
          width: ${CAT_WIDTH}px;
          height: ${CAT_HEIGHT}px;
          z-index: 40;
          border: 0;
          padding: 0;
          margin: 0;
          background: transparent;
          opacity: 0;
          pointer-events: none !important;
          transform: translate3d(0,0,0) scale(.94);
          transform-origin: center bottom;
          transition: opacity .3s ease, transform .3s ease;
          will-change: left, top;
        }
        .cute-footer-cat.is-visible { opacity: 1; transform: translate3d(0,0,0) scale(1); }
        .cute-cat-art { transform-origin: 42px 58px; }
        .cute-cat-body { transform-origin: 42px 58px; animation: cat-breathe 1.35s ease-in-out infinite; }
        .cute-cat-tail { transform-box: fill-box; transform-origin: 18% 72%; animation: cat-tail 1.45s ease-in-out infinite; }
        .cute-cat-paw { transform-box: fill-box; transform-origin: center top; }
        .cute-cat-eye { transform-box: fill-box; transform-origin: center; animation: cat-blink 3.4s ease-in-out infinite; }
        .cute-cat-eye-right { animation-delay: 1.2s; }
        .cute-cat-wink { opacity: 0; }
        .cute-cat-yarn { transform-origin: 16px 61px; animation: cat-yarn 1.45s ease-in-out infinite; }
        .cute-cat-pose-play .cute-cat-body { animation: cat-play 1.3s ease-in-out both; }
        .cute-cat-pose-play .cute-cat-paw-left { animation: cat-paw-play .65s ease-in-out infinite alternate; }
        .cute-cat-pose-stretch .cute-cat-body { animation: cat-stretch 1.2s ease-in-out both; }
        .cute-cat-pose-stretch .cute-cat-paw-left { animation: cat-stretch-paw 1.2s ease-in-out both; }
        .cute-cat-pose-groom .cute-cat-body { animation: cat-groom 1.35s ease-in-out both; }
        .cute-cat-pose-groom .cute-cat-paw-right { animation: cat-groom-paw .65s ease-in-out infinite alternate; }
        .cute-cat-pose-wink .cute-cat-eyes { animation: cat-wink 1.05s ease-in-out both; }
        .cute-cat-pose-wink .cute-cat-wink { opacity: 1; animation: cat-wink-line 1.05s ease-in-out both; }
        .cute-cat-pose-look .cute-cat-head { animation: cat-look 1.2s ease-in-out both; }
        .cute-cat-walk .cute-cat-paw-left { animation: cat-step .35s ease-in-out infinite alternate; }
        .cute-cat-walk .cute-cat-paw-right { animation: cat-step .35s ease-in-out .175s infinite alternate; }
        .cute-cat-walk .cute-cat-body { animation: cat-walk-body .7s ease-in-out infinite; }
        .cute-cat-walk .cute-cat-tail { animation-duration: .7s; }

        @keyframes cat-breathe { 0%,100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-1px) scaleY(1.015); } }
        @keyframes cat-tail { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(8deg); } }
        @keyframes cat-yarn { 0%,100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(7deg) translateY(-1px); } }
        @keyframes cat-blink { 0%,91%,100% { transform: scaleY(1); } 94%,97% { transform: scaleY(.08); } }
        @keyframes cat-wink { 0%,100% { transform: scaleY(1); } 35%,65% { transform: scaleY(.12); } }
        @keyframes cat-wink-line { 0%,100% { opacity: 0; } 25%,75% { opacity: 1; } }
        @keyframes cat-play { 0%,100% { transform: translateY(0) rotate(0); } 45% { transform: translateY(-3px) rotate(-2deg); } 70% { transform: translateY(1px) rotate(2deg); } }
        @keyframes cat-paw-play { from { transform: rotate(-9deg) translateY(0); } to { transform: rotate(8deg) translateY(-2px); } }
        @keyframes cat-stretch { 0% { transform: translateY(0) scaleY(1); } 55% { transform: translateY(4px) scaleY(.93); } 100% { transform: translateY(0) scaleY(1); } }
        @keyframes cat-stretch-paw { 0%,100% { transform: translateY(0) rotate(0); } 55% { transform: translateY(5px) rotate(-8deg); } }
        @keyframes cat-groom { 0%,100% { transform: translateX(0) rotate(0); } 50% { transform: translateX(2px) rotate(2deg); } }
        @keyframes cat-groom-paw { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
        @keyframes cat-look { 0%,100% { transform: rotate(0); } 50% { transform: rotate(5deg); } }
        @keyframes cat-step { from { transform: translateY(0) rotate(-6deg); } to { transform: translateY(-2px) rotate(7deg); } }
        @keyframes cat-walk-body { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }

        @media (max-width: 640px) {
          .cute-footer-cat { width: ${MOBILE_CAT_WIDTH}px; height: ${MOBILE_CAT_HEIGHT}px; }
          .cute-footer-cat svg { width: ${MOBILE_CAT_WIDTH}px; height: ${MOBILE_CAT_HEIGHT}px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cute-footer-cat,
          .cute-footer-cat * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
