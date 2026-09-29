"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export function Magnetic({
  children,
  className,
  strength = 0.35,
  as = "div",
  href,
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.6 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const style = reduce ? undefined : { x: sx, y: sy };
  const shared = {
    ref: ref as never,
    className: cn("btn-press inline-flex", className),
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style,
    "aria-label": ariaLabel,
  };

  if (as === "a" && href) {
    return (
      <motion.a href={href} {...shared}>
        {children}
      </motion.a>
    );
  }

  if (as === "button") {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        {...shared}
      >
        {children}
      </motion.button>
    );
  }

  return <motion.div {...shared}>{children}</motion.div>;
}
