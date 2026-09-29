"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { bookingSlots, profile } from "@/lib/data";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

export function ContactBook() {
  const [slot, setSlot] = useState(bookingSlots[0]?.id ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slot || !name.trim() || !email.trim()) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
  }

  const selected = bookingSlots.find((s) => s.id === slot);

  return (
    <section
      id="book"
      className="section-pad relative overflow-hidden border-t border-line bg-void-lift"
      aria-label="Book a call"
    >
      <div
        className="pointer-events-none absolute -right-[15%] top-0 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="telemetry text-accent">Contact</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Let&apos;s talk about your next build
          </h2>
          <p className="measure mt-4 text-ink-soft">
            A 30-minute call on goals, stack, and fit. Or email{" "}
            <a
              href={`mailto:${profile.email}`}
              className="font-medium text-accent underline-offset-4 transition-colors hover:underline"
            >
              {profile.email}
            </a>
            .
          </p>
        </div>

        {status === "done" ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-xl border border-line bg-void-panel p-8 sm:p-10"
          >
            <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              You&apos;re on the calendar
            </h3>
            <p className="mt-4 text-ink-soft">
              Thanks{name ? `, ${name}` : ""}. Expect an invite at{" "}
              <span className="font-medium text-ink">{email}</span>
              {selected ? (
                <>
                  {" "}
                  for {selected.day} {selected.date} at {selected.time}.
                </>
              ) : (
                "."
              )}
            </p>
            <button
              type="button"
              className="btn-press mt-8 min-h-11 rounded-[var(--radius-pill)] border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              onClick={() => {
                setStatus("idle");
                setName("");
                setEmail("");
                setProject("");
              }}
            >
              Book another slot
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
          >
            <fieldset>
              <legend className="text-sm font-semibold text-ink">
                Available times · 30 min
              </legend>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {bookingSlots.map((s) => {
                  const active = s.id === slot;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlot(s.id)}
                      className={cn(
                        "btn-press min-h-16 border px-3 py-3 text-left transition-[border-color,background,transform,box-shadow] duration-250",
                        active
                          ? "border-accent bg-accent text-on-accent shadow-[0_0_28px_var(--accent-glow)]"
                          : "border-line bg-void-panel text-ink hover:border-accent/40",
                      )}
                    >
                      <span className="block text-xs opacity-80">
                        {s.day} {s.date}
                      </span>
                      <span className="mt-1 block text-sm font-semibold">
                        {s.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="min-h-12 w-full border border-line bg-void-panel px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="min-h-12 w-full border border-line bg-void-panel px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
                  placeholder="you@company.com"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  Project notes{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </span>
                <textarea
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  rows={4}
                  className="w-full resize-y border border-line bg-void-panel px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
                  placeholder="What are you building?"
                />
              </label>

              <Magnetic as="div" strength={0.22} className="pt-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-press group inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-7 text-sm font-semibold text-on-accent shadow-[0_0_36px_var(--accent-glow)] transition-colors hover:bg-accent-deep disabled:opacity-60"
                >
                  {status === "submitting" ? "Booking…" : "Confirm booking"}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-accent/15 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                    ↗
                  </span>
                </button>
              </Magnetic>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
