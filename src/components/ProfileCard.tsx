"use client";

import React, { useEffect, useRef, useCallback, useMemo, type CSSProperties } from "react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#363f3a8c 0%,#66726b55 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (v: number, min = 0, max = 100): number => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3): number => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const KEYFRAMES_ID = "pc-keyframes";

function ensureKeyframes(): void {
  if (typeof document === "undefined" || document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

interface ProfileCardProps {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "/avatar.png",
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Zain",
  title = "Software Engineer",
  handle = "/in/zain-rehan/",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  useEffect(() => {
    ensureKeyframes();
  }, []);

  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number): void => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = (): void => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number): void {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number): void {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter(): void {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number): void {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel(): void {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (evt: PointerEvent, el: HTMLElement): { x: number; y: number } => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add("active");
      shell.classList.add("entering");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback((): void => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = (): void => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight,
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity],
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    shell.addEventListener("pointerenter", pointerEnterHandler);
    shell.addEventListener("pointermove", pointerMoveHandler);
    shell.addEventListener("pointerleave", pointerLeaveHandler);

    const handleClick = (): void => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<string>;
      };
      if (anyMotion && typeof anyMotion.requestPermission === "function") {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", deviceOrientationHandler);
      }
    };
    shell.addEventListener("click", handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", pointerEnterHandler);
      shell.removeEventListener("pointermove", pointerMoveHandler);
      shell.removeEventListener("pointerleave", pointerLeaveHandler);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove("entering");
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardRadius = "30px";

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color": behindGlowColor ?? "rgba(102, 114, 107, 0.55)",
        "--behind-glow-size": behindGlowSize ?? "50%",
        "--pointer-x": "50%",
        "--pointer-y": "50%",
        "--pointer-from-center": "0",
        "--pointer-from-top": "0.5",
        "--pointer-from-left": "0.5",
        "--card-opacity": "0",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--background-x": "50%",
        "--background-y": "50%",
        "--card-radius": cardRadius,
        "--sunpillar-1": "hsl(140, 12%, 55%)",
        "--sunpillar-2": "hsl(95, 14%, 62%)",
        "--sunpillar-3": "hsl(160, 10%, 58%)",
        "--sunpillar-4": "hsl(180, 8%, 65%)",
        "--sunpillar-5": "hsl(200, 10%, 60%)",
        "--sunpillar-6": "hsl(120, 10%, 52%)",
        "--sunpillar-clr-1": "var(--sunpillar-1)",
        "--sunpillar-clr-2": "var(--sunpillar-2)",
        "--sunpillar-clr-3": "var(--sunpillar-3)",
        "--sunpillar-clr-4": "var(--sunpillar-4)",
        "--sunpillar-clr-5": "var(--sunpillar-5)",
        "--sunpillar-clr-6": "var(--sunpillar-6)",
      }) as CSSProperties,
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize],
  );

  const handleContactClick = useCallback((): void => {
    const subject = encodeURIComponent("Project inquiry");
    const body = encodeURIComponent(
      "Hi Zain,\n\nI'd like to discuss a project with you.\n\nProject overview:\n\nTimeline:\n\nBudget range:\n\nBest,\n",
    );
    window.location.href = `mailto:zainrehan395@gmail.com?subject=${subject}&body=${body}`;
    onContactClick?.();
  }, [onContactClick]);

  const shineStyle: CSSProperties = {
    maskImage: "var(--icon)",
    maskMode: "luminance",
    maskRepeat: "repeat",
    maskSize: "150%",
    maskPosition: "top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))",
    filter: "brightness(0.66) contrast(1.33) saturate(0.33) opacity(0.2)",
    animation: "pc-holo-bg 18s linear infinite",
    animationPlayState: "running",
    mixBlendMode: "color-dodge",
    transform: "translate3d(0, 0, 1px)",
    overflow: "hidden",
    zIndex: 3,
    background: "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--sunpillar-clr-1) 5%,
        var(--sunpillar-clr-2) 10%,
        var(--sunpillar-clr-3) 15%,
        var(--sunpillar-clr-4) 20%,
        var(--sunpillar-clr-5) 25%,
        var(--sunpillar-clr-6) 30%,
        var(--sunpillar-clr-1) 35%
      ),
      repeating-linear-gradient(
        -45deg,
        #212d2d 0%,
        hsl(140, 8%, 45%) 3.8%,
        hsl(140, 12%, 52%) 4.5%,
        hsl(140, 8%, 45%) 5.2%,
        #212d2d 10%,
        #212d2d 12%
      ),
      radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(0, 0%, 0%, 0.1) 12%,
        hsla(0, 0%, 0%, 0.15) 20%,
        hsla(0, 0%, 0%, 0.25) 120%
      )
    `.replace(/\s+/g, " "),
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
  };

  const glareStyle: CSSProperties = {
    transform: "translate3d(0, 0, 1.1px)",
    overflow: "hidden",
    backgroundImage: `radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsl(180, 0.60%, 67.30%) 12%,
      hsla(147, 8%, 23%, 0.8) 90%
    )`,
    mixBlendMode: "overlay",
    filter: "brightness(0.8) contrast(1.2)",
    zIndex: 4,
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
  };

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none ${className}`.trim()}
      style={
        {
          perspective: "500px",
          transform: "translate3d(0, 0, 0.1px)",
          ...cardStyle,
        } as CSSProperties
      }
    >
      {behindGlowEnabled && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ease-out"
          style={{
            background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
            filter: "blur(50px) saturate(1.1)",
            opacity: "calc(0.8 * var(--card-opacity))",
          }}
        />
      )}
      <div ref={shellRef} className="group relative z-[1]">
        <section
          className="relative grid overflow-hidden"
          style={{
            height: "min(78svh, 640px)",
            maxHeight: "640px",
            aspectRatio: "0.718",
            borderRadius: cardRadius,
            backgroundBlendMode: "color-dodge, normal, normal, normal",
            boxShadow:
              "rgba(0, 0, 0, 0.55) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px",
            transition: "transform 1s ease",
            transform: "translateZ(0) rotateX(0deg) rotateY(0deg)",
            background: "rgba(33, 45, 45, 0.95)",
            backfaceVisibility: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transition = "none";
            e.currentTarget.style.transform =
              "translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))";
          }}
          onMouseLeave={(e) => {
            const shell = shellRef.current;
            if (shell?.classList.contains("entering")) {
              e.currentTarget.style.transition = "transform 180ms ease-out";
            } else {
              e.currentTarget.style.transition = "transform 1s ease";
            }
            e.currentTarget.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "var(--inner-gradient)",
              backgroundColor: "rgba(33, 45, 45, 0.95)",
              borderRadius: cardRadius,
              display: "grid",
              gridArea: "1 / -1",
            }}
          >
            <div style={shineStyle} />
            <div style={glareStyle} />

            <div
              className="overflow-visible"
              style={{
                mixBlendMode: "luminosity",
                transform: "translateZ(2px)",
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
                backfaceVisibility: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute bottom-[-1px] left-1/2 w-full will-change-transform transition-transform duration-[120ms] ease-out"
                src={avatarUrl}
                alt={`${name || "User"} avatar`}
                loading="lazy"
                style={{
                  transformOrigin: "50% 100%",
                  top: "15%",
                  left: "1% !important",
                  borderRadius: cardRadius,
                  backfaceVisibility: "hidden",
                }}
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                }}
              />
            </div>

            {showUserInfo && (
              <div
                className="pointer-events-auto absolute z-10 flex items-center justify-between border border-white/10 backdrop-blur-[30px]"
                style={
                  {
                    "--ui-inset": "20px",
                    "--ui-radius-bias": "6px",
                    bottom: "var(--ui-inset)",
                    left: "var(--ui-inset)",
                    right: "var(--ui-inset)",
                    background: "rgba(33, 45, 45, 0.55)",
                    borderRadius:
                      "calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)))",
                    padding: "12px 14px",
                    isolation: "isolate",
                  } as CSSProperties
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start gap-1.5">
                    <a
                      href={`https://www.linkedin.com${handle.startsWith("/") ? handle : `/${handle}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium leading-none text-white/90 transition-colors hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LinkedInIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{handle}</span>
                    </a>
                    <div className="flex items-center gap-2 text-sm leading-none text-white/80">
                      <span
                        className="relative flex h-2.5 w-2.5 shrink-0"
                        aria-hidden
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                      </span>
                      {status}
                    </div>
                  </div>
                </div>
                <button
                  className="cursor-pointer rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold text-white/90 backdrop-blur-[10px] transition-all duration-200 ease-out hover:-translate-y-px hover:border-white/40"
                  onClick={handleContactClick}
                  style={{ pointerEvents: "auto", display: "block", borderRadius: "8px" }}
                  type="button"
                  aria-label={`Contact ${name || "user"}`}
                >
                  {contactText}
                </button>
              </div>
            )}

            <div
              className="relative z-[5] max-h-full overflow-hidden text-center"
              style={{
                transform:
                  "translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)",
                mixBlendMode: "luminosity",
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
              }}
            >
              {/* <div
                className="absolute flex w-full flex-col"
                style={{ top: "3em", display: "flex" }}
              >
                <h3
                  className="m-0 font-semibold"
                  style={{
                    fontSize: "min(5svh, 3em)",
                    backgroundImage: "linear-gradient(to bottom, #e6eae7, #66726b)",
                    backgroundSize: "1em 1.5em",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {name}
                </h3>
                <p
                  className="mx-auto w-min whitespace-nowrap font-semibold"
                  style={{
                    position: "relative",
                    top: "-12px",
                    fontSize: "16px",
                    margin: "0 auto",
                    backgroundImage: "linear-gradient(to bottom, #e6eae7, #40423b)",
                    backgroundSize: "1em 1.5em",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {title}
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
