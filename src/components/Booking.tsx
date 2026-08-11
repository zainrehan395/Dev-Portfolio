"use client";

import { useState, type FormEvent } from "react";
import { bookingSlots, profile } from "@/lib/data";

type Status = "idle" | "submitting" | "done";

export function Booking() {
  const [slot, setSlot] = useState(bookingSlots[0]?.id ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");

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
      className="relative border-t border-line/80 bg-surface py-24 text-cream sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 20% 30%, color-mix(in srgb, var(--sage) 22%, transparent), transparent), radial-gradient(ellipse 40% 35% at 80% 70%, color-mix(in srgb, var(--surface) 70%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
            Let&apos;s talk about your next build
          </h2>
          <p className="mt-4 text-lg text-sage">
            Book a 30-minute call - product goals, stack choices, and whether I&apos;m the right
            engineer for the work. Or reach me at {profile.email}.
          </p>
        </div>

        {status === "done" ? (
          <div data-reveal className="liquid-glass-panel max-w-xl p-8 sm:p-10">
            <h3 className="font-display text-3xl font-semibold text-cream">
              You&apos;re on the calendar
            </h3>
            <p className="mt-4 text-cream/75">
              Thanks{name ? `, ${name}` : ""}. Expect a calendar invite at{" "}
              <span className="font-medium text-cream">{email}</span>
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
              className="liquid-glass-btn mt-8 min-h-11 rounded-xl px-5 text-sm font-medium"
              onClick={() => {
                setStatus("idle");
                setName("");
                setEmail("");
                setProject("");
              }}
            >
              Book another slot
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
            data-reveal
          >
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">
                Available times · 30 min
              </legend>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {bookingSlots.map((s) => {
                  const selectedSlot = s.id === slot;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlot(s.id)}
                      className={`min-h-16 rounded-xl px-3 py-3 text-left transition-colors duration-200 ${
                        selectedSlot
                          ? "liquid-glass-btn-solid"
                          : "liquid-glass-btn"
                      }`}
                      aria-pressed={selectedSlot}
                    >
                      <span className="block font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                        {s.day} · {s.date}
                      </span>
                      <span className="mt-1 block font-display text-xl font-semibold">
                        {s.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="liquid-glass-panel flex flex-col gap-5 p-6 sm:p-8">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage">
                  Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="liquid-glass-input mt-2 min-h-12 w-full rounded-xl px-4"
                  autoComplete="name"
                  placeholder="Alex Rivera"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage">
                  Work email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="liquid-glass-input mt-2 min-h-12 w-full rounded-xl px-4"
                  autoComplete="email"
                  placeholder="alex@company.com"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage">
                  Project note
                </span>
                <textarea
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  rows={3}
                  className="liquid-glass-input mt-2 w-full resize-none rounded-xl px-4 py-3"
                  placeholder="What are you building?"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="liquid-glass-btn-solid mt-2 inline-flex min-h-12 items-center justify-center rounded-xl px-6 text-base font-semibold disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Scheduling…" : "Confirm booking"}
              </button>

              <p className="font-mono text-[11px] leading-relaxed tracking-wide text-sage">
                {profile.email} · {profile.phone} · {profile.location}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
