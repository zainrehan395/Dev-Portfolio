"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/lib/data";

export function EntryCurtain() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setShow(false);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const visible = Boolean(show && !reduce);
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ y: "-105%", opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden={!visible}
        >
          <button
            type="button"
            onClick={() => setShow(false)}
            className="absolute right-5 top-5 text-xs font-medium text-ink-soft underline-offset-4 hover:text-accent hover:underline sm:right-8"
          >
            Skip
          </button>

          <div className="w-full max-w-md px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="telemetry text-accent"
            >
              Booting systems
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
            >
              {profile.name}
              <span className="text-accent">.</span>
            </motion.p>

            <div className="mt-10 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full origin-left bg-accent"
                style={{ scaleX: progress }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="telemetry">Initializing</span>
              <span className="font-mono text-xs tabular-nums text-accent">
                {String(pct).padStart(2, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
