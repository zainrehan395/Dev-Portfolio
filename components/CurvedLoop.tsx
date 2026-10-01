"use client";

import { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent } from 'react';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = false
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [resolvedCurve, setResolvedCurve] = useState(curveAmount);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + resolvedCurve} 1540,40`;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setResolvedCurve(mq.matches ? Math.min(curveAmount, 160) : curveAmount);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [curveAmount]);

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);
  const axisLockRef = useRef<'x' | 'y' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
      .fill(text)
      .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;

    const step = () => {
      if (textPathRef.current) {
        if (!dragRef.current) {
          const targetSpeed = dirRef.current === "right" ? speed : -speed;
          velRef.current += (targetSpeed - velRef.current) * 0.05;

          const currentOffset = parseFloat(
            textPathRef.current.getAttribute("startOffset") || "0"
          );
          let newOffset = currentOffset + velRef.current;
          const wrapPoint = spacing;

          if (newOffset <= -wrapPoint) newOffset += wrapPoint;
          if (newOffset > 0) newOffset -= wrapPoint;

          // ✅ Only write to the DOM — no setState, no re-render
          textPathRef.current.setAttribute("startOffset", newOffset + "px");
        } else {
          velRef.current *= 0.88;
        }
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    axisLockRef.current = null;
    setIsDragging(true);
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const dy = e.clientY - lastYRef.current;

    // On touch, lock to the dominant axis so vertical page scroll still works.
    if (!axisLockRef.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      axisLockRef.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      if (axisLockRef.current === 'y') {
        dragRef.current = false;
        setIsDragging(false);
        return;
      }
    }

    if (axisLockRef.current === 'y') return;

    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    axisLockRef.current = null;
    setIsDragging(false);
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (isDragging ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      className="flex items-center justify-center w-full py-2 md:py-0 md:translate-y-[-40%] select-none"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle, touchAction: interactive ? 'pan-y' : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      role={interactive ? "img" : undefined}
      aria-label={interactive ? "Interactive scrolling text — drag to scrub" : undefined}
    >
      <svg
        className="select-none w-full overflow-visible block aspect-[100/18] sm:aspect-[100/14] md:aspect-100/12 text-[1.85rem] sm:text-[4rem] md:text-[6rem] font-bold uppercase leading-none"
        viewBox="0 0 1440 120"
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
            <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
