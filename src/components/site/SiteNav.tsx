"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Magnetic } from "./Magnetic";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#craft", label: "Craft" },
  { href: "#systems", label: "Systems" },
  { href: "#process", label: "Process" },
  { href: "#book", label: "Book" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[50] transition-[background,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-line bg-void/80 shadow-[0_1px_0_var(--line)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between px-5 sm:px-8"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="font-display text-sm font-bold tracking-tight text-ink sm:text-base"
        >
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <ul className="flex items-center gap-5 lg:hidden">
            {links.slice(0, 2).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-ink-soft hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Magnetic as="a" href="#book" strength={0.28} className="group">
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors duration-200 group-hover:bg-accent-deep">
              Book a call
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-on-accent/15 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                ↗
              </span>
            </span>
          </Magnetic>
        </div>

        <button
          type="button"
          className="relative z-[61] flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3.5 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform duration-300",
                open && "top-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[6px] h-[1.5px] w-full bg-ink transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 bottom-0 h-[1.5px] w-full bg-ink transition-transform duration-300",
                open && "bottom-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-void/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-6 px-8">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    className="font-display text-4xl font-bold tracking-tight"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li>
                <a
                  href="#book"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex rounded-[var(--radius-pill)] bg-accent px-6 py-3 text-sm font-semibold text-on-accent"
                >
                  Book a call
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
