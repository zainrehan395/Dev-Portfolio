"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  /** When set, disables autoplay and animates so this child index is in front. */
  activeIndex?: number;
  /** Layout of the stack within its parent. */
  align?: "corner" | "center";
  className?: string;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl border border-deep/15 bg-surface [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number,
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  activeIndex,
  align = "corner",
  className = "",
  children,
}) => {
  const controlled = activeIndex !== undefined;
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: controlled ? 0.85 : 2,
          durMove: controlled ? 0.85 : 2,
          durReturn: controlled ? 0.85 : 2,
          promoteOverlap: 0.85,
          returnDelay: 0.05,
          dropBy: controlled ? 280 : 500,
        }
      : {
          ease: "power3.out",
          durDrop: controlled ? 0.38 : 0.8,
          durMove: controlled ? 0.42 : 0.8,
          durReturn: controlled ? 0.4 : 0.8,
          promoteOverlap: 0.55,
          returnDelay: 0.12,
          dropBy: controlled ? 220 : 500,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length],
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i),
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const swapping = useRef(false);
  const placed = useRef(false);
  const pendingIndex = useRef<number | null>(null);
  const configRef = useRef(config);
  const distancesRef = useRef({ cardDistance, verticalDistance, skewAmount });

  configRef.current = config;
  distancesRef.current = { cardDistance, verticalDistance, skewAmount };

  const applySlots = (skew: number, animate = false) => {
    const { cardDistance: distX, verticalDistance: distY } = distancesRef.current;
    const total = refs.length;
    const cfg = configRef.current;
    order.current.forEach((childIdx, slotIdx) => {
      const el = refs[childIdx].current;
      if (!el) return;
      const slot = makeSlot(slotIdx, distX, distY, total);
      if (animate) {
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          skewY: skew,
          duration: cfg.durMove,
          ease: cfg.ease,
          overwrite: "auto",
        });
      } else {
        placeNow(el, slot, skew);
      }
    });
  };

  const flushPending = () => {
    swapping.current = false;
    const pending = pendingIndex.current;
    if (pending !== null && order.current[0] !== pending) {
      goToIndex(pending);
    } else {
      pendingIndex.current = null;
    }
  };

  const swapForward = () => {
    if (order.current.length < 2 || swapping.current) return;
    const { cardDistance: distX, verticalDistance: distY, skewAmount: skew } =
      distancesRef.current;
    const cfg = configRef.current;

    const [front, ...rest] = order.current;
    const elFront = refs[front].current;
    if (!elFront) return;

    swapping.current = true;
    const tl = gsap.timeline({ onComplete: flushPending });
    tlRef.current = tl;

    tl.to(elFront, {
      y: `+=${cfg.dropBy}`,
      opacity: 0.35,
      duration: cfg.durDrop,
      ease: cfg.ease,
    });

    tl.addLabel("promote", `-=${cfg.durDrop * cfg.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = refs[idx].current!;
      const slot = makeSlot(i, distX, distY, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: cfg.durMove,
          ease: cfg.ease,
        },
        `promote+=${i * 0.08}`,
      );
    });

    const backSlot = makeSlot(refs.length - 1, distX, distY, refs.length);
    tl.addLabel("return", `promote+=${cfg.durMove * cfg.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      "return",
    );
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        skewY: skew,
        opacity: 1,
        duration: cfg.durReturn,
        ease: cfg.ease,
      },
      "return",
    );

    tl.call(() => {
      order.current = [...rest, front];
    });
  };

  const swapBackward = () => {
    if (order.current.length < 2 || swapping.current) return;
    const { cardDistance: distX, verticalDistance: distY, skewAmount: skew } =
      distancesRef.current;
    const cfg = configRef.current;
    const total = refs.length;

    const back = order.current[order.current.length - 1];
    const rest = order.current.slice(0, -1);
    const elBack = refs[back].current;
    if (!elBack) return;

    swapping.current = true;
    const frontSlot = makeSlot(0, distX, distY, total);
    const tl = gsap.timeline({ onComplete: flushPending });
    tlRef.current = tl;

    // Lift the back card above, then drop it to front
    tl.set(elBack, { zIndex: total + 2 });
    tl.to(elBack, {
      y: frontSlot.y - cfg.dropBy * 0.55,
      x: frontSlot.x,
      z: frontSlot.z + 40,
      opacity: 0.5,
      duration: cfg.durDrop * 0.7,
      ease: "power2.in",
    });

    tl.addLabel("settle");
    tl.to(
      elBack,
      {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        skewY: skew,
        opacity: 1,
        duration: cfg.durReturn,
        ease: cfg.ease,
      },
      "settle",
    );
    tl.set(elBack, { zIndex: frontSlot.zIndex }, "settle");

    rest.forEach((idx, i) => {
      const el = refs[idx].current!;
      const slot = makeSlot(i + 1, distX, distY, total);
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: cfg.durMove,
          ease: cfg.ease,
        },
        `settle+=${i * 0.06}`,
      );
    });

    tl.call(() => {
      order.current = [back, ...rest];
    });
  };

  const goToIndex = (target: number) => {
    if (target < 0 || target >= refs.length) return;
    if (order.current[0] === target) {
      pendingIndex.current = null;
      return;
    }

    if (swapping.current) {
      pendingIndex.current = target;
      return;
    }

    const nextFront = order.current[1];
    const prevFront = order.current[order.current.length - 1];

    if (nextFront === target) {
      swapForward();
      return;
    }

    if (prevFront === target) {
      swapBackward();
      return;
    }

    // Multi-step jump: animate toward nearest neighbor first, queue the rest
    const forwardSteps = order.current.indexOf(target);
    const backwardSteps = order.current.length - forwardSteps;
    if (forwardSteps > 0 && forwardSteps <= backwardSteps) {
      pendingIndex.current = target;
      swapForward();
      return;
    }
    if (backwardSteps > 0) {
      pendingIndex.current = target;
      swapBackward();
      return;
    }

    tlRef.current?.kill();
    swapping.current = false;
    const rest = order.current.filter((i) => i !== target);
    order.current = [target, ...rest];
    applySlots(distancesRef.current.skewAmount, true);
    pendingIndex.current = null;
  };

  // Initial layout + optional autoplay
  useEffect(() => {
    const total = refs.length;
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((r, i) =>
      placeNow(
        r.current!,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount,
      ),
    );
    placed.current = true;

    if (controlled) {
      if (activeIndex !== undefined && activeIndex !== 0) {
        const rest = order.current.filter((i) => i !== activeIndex);
        order.current = [activeIndex, ...rest];
        applySlots(skewAmount);
      }
      return;
    }

    swapForward();
    intervalRef.current = window.setInterval(swapForward, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swapForward, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, childArr.length]);

  useEffect(() => {
    if (activeIndex === undefined || !placed.current) return;
    goToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  const alignClass =
    align === "center"
      ? "relative mx-auto overflow-visible perspective-[1100px]"
      : "absolute bottom-0 right-0 origin-bottom-right translate-x-[5%] translate-y-[12%] overflow-visible perspective-[900px] max-[768px]:translate-x-[18%] max-[768px]:translate-y-[18%] max-[768px]:scale-[0.78] max-[480px]:translate-x-[12%] max-[480px]:translate-y-[20%] max-[480px]:scale-[0.62]";

  return (
    <div
      ref={container}
      className={`${alignClass} ${className}`.trim()}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
