"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { SITE_CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;

export default function HUD() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-0 z-[200] flex flex-col bg-[#0c0f0d]"
          >
            <div className="flex items-center justify-between gap-4 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3">
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/50 truncate">
                {SITE_CONFIG.name} © {new Date().getFullYear()}
              </span>
              <button
                type="button"
                onClick={closeMenu}
                className="relative z-[210] flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/5 text-white active:scale-[0.96] transition-transform"
                aria-label="Close menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3l12 12M15 3L3 15"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center gap-1 px-6 pb-16"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  className="font-mono text-2xl uppercase tracking-wider text-white py-4 border-b border-white/10 active:text-brand transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${SITE_CONFIG.email}`}
                onClick={closeMenu}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.3 }}
                className="mt-8 font-mono text-sm text-brand tracking-wide py-3"
              >
                {SITE_CONFIG.email}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="flex justify-between items-center gap-4 px-4 sm:px-6 md:px-12 pt-5 md:pt-7 mix-blend-difference text-[#f3f3f3] uppercase font-mono text-[8px] sm:text-[10px] md:text-xs tracking-widest">
          <div className="flex items-center gap-4 min-w-0">
            <a
              href="#top"
              className="pointer-events-auto truncate hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              onClick={closeMenu}
            >
              {SITE_CONFIG.name} © {new Date().getFullYear()}
            </a>
          </div>

          <nav
            aria-label="Primary"
            className="hidden sm:flex items-center gap-5 pointer-events-auto"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {!menuOpen && (
            <button
              type="button"
              className="sm:hidden pointer-events-auto flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-black/30 active:scale-[0.97] transition-transform"
              aria-expanded={false}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="sr-only">Menu</span>
              <span className="flex flex-col gap-1.5" aria-hidden="true">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          )}
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
