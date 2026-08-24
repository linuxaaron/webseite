"use client";

import { useEffect, useRef, useState } from "react";

const CAT_WIDTH = 82;
const CAT_HEIGHT = 74;
const MOBILE_CAT_WIDTH = 68;
const MOBILE_CAT_HEIGHT = 62;
const EDGE_PADDING = 18;
const MOBILE_EDGE_PADDING = 8;
const CAT_CURSOR_GAP = 92;
const FOLLOW_SPEED = 0.17;

const POSES = ["sit", "play", "stretch", "groom", "wink", "look"] as const;
type CatPose = (typeof POSES)[number];

const POSE_DURATIONS: Record<CatPose, number> = {
  sit: 1100,
  play: 1100,
  stretch: 900,
  groom: 1000,
  wink: 850,
  look: 900,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CuteFooterCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const poseTimerRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const touchDeviceRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [pose, setPose] = useState<CatPose>("sit");

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

    const isInsideFooter = (x: number, y: number) => {
      const rect = footer.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const setPosition = (x: number, y: number) => {
      positionRef.current = { x, y };
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;
    };

    const scheduleNextPose = () => {
      if (poseTimerRef.current !== null) window.clearTimeout(poseTimerRef.current);
      if (reducedMotionRef.current) return;

      const currentIndex = POSES.indexOf(pose);
      const nextPose = POSES[(currentIndex + 1) % POSES.length];
      poseTimerRef.current = window.setTimeout(() => {
        if (visibleRef.current && document.visibilityState !== "hidden") {
          setPose(nextPose);
        }
        scheduleNextPose();
      }, POSE_DURATIONS[pose]);
    };

    const animate = () => {
      const current = positionRef.current;
      const target = targetRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.hypot(dx, dy);

      if (activeRef.current && !touchDeviceRef.current) {
        setPosition(current.x + dx * FOLLOW_SPEED, current.y + dy * FOLLOW_SPEED);
        cat.style.setProperty("--walk-direction", dx < -1 ? "-1" : "1");
        cat.classList.toggle("cute-cat-walk", distance > 3);
      } else {
        cat.classList.remove("cute-cat-walk");
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const moveToCursor = (event: PointerEvent) => {
      if (touchDeviceRef.current || !isInsideFooter(event.clientX, event.clientY)) return;
      const rect = footer.getBoundingClientRect();
      const maxLeft = Math.min(window.innerWidth - CAT_WIDTH - EDGE_PADDING, rect.right - CAT_WIDTH - EDGE_PADDING);
      const minLeft = Math.max(EDGE_PADDING, rect.left + EDGE_PADDING);
      const maxTop = Math.min(window.innerHeight - CAT_HEIGHT - EDGE_PADDING, rect.bottom - CAT_HEIGHT - EDGE_PADDING);
      const minTop = Math.max(EDGE_PADDING, rect.top + EDGE_PADDING);

      targetRef.current = {
        x: clamp(event.clientX + CAT_CURSOR_GAP - CAT_WIDTH / 2, minLeft, maxLeft),
        y: clamp(event.clientY - CAT_HEIGHT / 2, minTop, maxTop),
      };
      activeRef.current = true;
      setCatVisible(true);
    };

    const enterFooter = (event: PointerEvent) => {
      if (touchDeviceRef.current || !isInsideFooter(event.clientX, event.clientY)) return;
      const resting = getRestingPosition();
      setPosition(resting.x, resting.y);
      targetRef.current = resting;
      activeRef.current = true;
      setCatVisible(true);
    };

    const leaveFooter = (event: PointerEvent) => {
      if (touchDeviceRef.current) return;
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && footer.contains(nextTarget)) return;
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
      if (touchDeviceRef.current) updateMobileCat();
      else if (!activeRef.current) setPosition(getRestingPosition().x, getRestingPosition().y);
    };

    const observer = new IntersectionObserver(([entry]) => {
      setCatVisible(entry.isIntersecting);
      if (touchDeviceRef.current && entry.isIntersecting) updateMobileCat();
    }, { threshold: 0.05 });

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (event.matches) {
        if (poseTimerRef.current !== null) window.clearTimeout(poseTimerRef.current);
        setPose("sit");
      } else {
        scheduleNextPose();
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
    scheduleNextPose();

    return () => {
      observer.disconnect();
      footer.removeEventListener("pointerenter", enterFooter);
      footer.removeEventListener("pointermove", moveToCursor);
      footer.removeEventListener("pointerleave", leaveFooter);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateMobileCat);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (poseTimerRef.current !== null) window.clearTimeout(poseTimerRef.current);
    };
  }, [pose]);

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
              <path d="M22 34 L24 13 L36 23 C40 21 44 21 48 23 L60 13 L61 35 C61 48 53 54 42 54 C30 54 22 47 22 34Z" fill="url(#cat-fur)" />
              <path d="M26 25 L26 18 L34 24 C31 24 29 24 26 25Z" fill="#f3a7b8" />
              <path d="M57 25 L58 18 L50 24 C53 24 55 24 57 25Z" fill="#f3a7b8" />

              <g className="cute-cat-eyes">
                <ellipse className="cute-cat-eye cute-cat-eye-left" cx="33.5" cy="34" rx="6" ry="7.5" fill="#5bb7ff" />
                <ellipse className="cute-cat-eye cute-cat-eye-right" cx="50.5" cy="34" rx="6" ry="7.5" fill="#5bb7ff" />
                <ellipse cx="34" cy="35" rx="2.1" ry="4.3" fill="#13243a" />
                <ellipse cx="50" cy="35" rx="2.1" ry="4.3" fill="#13243a" />
                <circle cx="32" cy="31.5" r="1.6" fill="#fff" />
                <circle cx="48" cy="31.5" r="1.6" fill="#fff" />
              </g>

              <path className="cute-cat-wink" d="M47 34 C49 32 52 32 54 34" fill="none" stroke="#243247" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M39 40 Q42 43 45 40" fill="none" stroke="#596579" strokeWidth="1.2" strokeLinecap="round" />
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
        .cute-cat-body { transform-origin: 42px 58px; animation: cat-breathe 1s ease-in-out infinite; }
        .cute-cat-tail { transform-box: fill-box; transform-origin: 18% 72%; animation: cat-tail 1.05s ease-in-out infinite; }
        .cute-cat-paw { transform-box: fill-box; transform-origin: center top; }
        .cute-cat-eye { transform-box: fill-box; transform-origin: center; animation: cat-blink 3.1s ease-in-out infinite; }
        .cute-cat-eye-right { animation-delay: 1.15s; }
        .cute-cat-wink { opacity: 0; }
        .cute-cat-yarn { transform-origin: 16px 61px; animation: cat-yarn 1.1s ease-in-out infinite; }
        .cute-cat-pose-play .cute-cat-body { animation: cat-play 1.1s ease-in-out both; }
        .cute-cat-pose-play .cute-cat-paw-left { animation: cat-paw-play .55s ease-in-out infinite alternate; }
        .cute-cat-pose-stretch .cute-cat-body { animation: cat-stretch .9s ease-in-out both; }
        .cute-cat-pose-stretch .cute-cat-paw-left { animation: cat-stretch-paw .9s ease-in-out both; }
        .cute-cat-pose-groom .cute-cat-body { animation: cat-groom 1s ease-in-out both; }
        .cute-cat-pose-groom .cute-cat-paw-left { animation: cat-groom-paw 1s ease-in-out both; }
        .cute-cat-pose-wink .cute-cat-eye-right { animation: none; transform: scaleY(.08); }
        .cute-cat-pose-wink .cute-cat-wink { opacity: 1; animation: cat-wink .85s ease-in-out both; }
        .cute-cat-pose-look .cute-cat-head { animation: cat-look .9s ease-in-out both; }
        .cute-cat-walk .cute-cat-body { animation: cat-walk .28s ease-in-out infinite alternate; }
        .cute-cat-walk .cute-cat-paw-left { animation: cat-step-left .28s ease-in-out infinite alternate; }
        .cute-cat-walk .cute-cat-paw-right { animation: cat-step-right .28s ease-in-out infinite alternate; }

        @keyframes cat-breathe { 0%,100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-1.5px) scaleY(1.02); } }
        @keyframes cat-tail { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(18deg); } }
        @keyframes cat-blink { 0%,82%,100% { transform: scaleY(1); } 87% { transform: scaleY(.08); } 91% { transform: scaleY(1); } }
        @keyframes cat-yarn { 0%,100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(6deg) translateY(-2px); } }
        @keyframes cat-play { 0%,100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-2px) rotate(-3deg); } 55% { transform: translateY(-5px) rotate(4deg); } 80% { transform: translateY(-1px) rotate(-2deg); } }
        @keyframes cat-paw-play { from { transform: rotate(-8deg) translateY(0); } to { transform: rotate(14deg) translateY(-5px); } }
        @keyframes cat-stretch { 0% { transform: translateY(0) scaleY(1); } 45% { transform: translateY(3px) scaleY(.92); } 70% { transform: translateY(-3px) scaleY(1.08) rotate(-3deg); } 100% { transform: translateY(0) scaleY(1); } }
        @keyframes cat-stretch-paw { 0%,100% { transform: translateY(0) rotate(0); } 55% { transform: translateY(7px) rotate(-10deg); } }
        @keyframes cat-groom { 0%,100% { transform: rotate(0); } 35% { transform: rotate(-7deg) translateY(-1px); } 65% { transform: rotate(5deg) translateY(-2px); } }
        @keyframes cat-groom-paw { 0%,100% { transform: translate(0,0) rotate(0); } 45% { transform: translate(-3px,-7px) rotate(-18deg); } 70% { transform: translate(-2px,-5px) rotate(12deg); } }
        @keyframes cat-wink { 0%,65%,100% { opacity: 0; } 72%,90% { opacity: 1; } }
        @keyframes cat-look { 0%,100% { transform: translateX(0) rotate(0); } 35% { transform: translateX(2px) rotate(4deg); } 65% { transform: translateX(-2px) rotate(-4deg); } }
        @keyframes cat-walk { from { transform: translateY(0) rotate(-1deg); } to { transform: translateY(-2.5px) rotate(1deg); } }
        @keyframes cat-step-left { from { transform: translateY(0) rotate(5deg); } to { transform: translateY(-4px) rotate(-8deg); } }
        @keyframes cat-step-right { from { transform: translateY(-4px) rotate(-8deg); } to { transform: translateY(0) rotate(5deg); } }

        @media (hover: none), (pointer: coarse) {
          .cute-footer-cat { width: ${MOBILE_CAT_WIDTH}px; height: ${MOBILE_CAT_HEIGHT}px; transform: translate3d(0,0,0) scale(.82); }
          .cute-footer-cat.is-visible { transform: translate3d(0,0,0) scale(.82); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cute-footer-cat *, .cute-footer-cat { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
