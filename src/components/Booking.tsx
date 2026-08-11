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
      className="relative border-t border-line/80 bg-surface py-24 text-deep sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 20% 30%, rgba(189,210,182,0.45), transparent), radial-gradient(ellipse 40% 35% at 80% 70%, rgba(121,135,119,0.12), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-deep/70">
            Booking
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-deep sm:text-5xl">
            Let&apos;s talk about your next build
          </h2>
          <p className="mt-4 text-lg text-deep/75">
            Book a 30-minute call — product goals, stack choices, and whether I&apos;m the right
            engineer for the work. Or reach me at {profile.email}.
          </p>
        </div>

        {status === "done" ? (
          <div data-reveal className="max-w-xl border border-deep/15 bg-sage/35 p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/70">
              Confirmed
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-deep">
              You&apos;re on the calendar
            </h3>
            <p className="mt-4 text-deep/75">
              Thanks{name ? `, ${name}` : ""}. Expect a calendar invite at{" "}
              <span className="text-deep font-medium">{email}</span>
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
              className="mt-8 min-h-11 border border-deep/30 px-5 text-sm font-medium text-deep transition-colors hover:bg-deep hover:text-cream"
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
              <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/70">
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
                      className={`min-h-16 border px-3 py-3 text-left transition-colors duration-200 ${
                        selectedSlot
                          ? "border-deep bg-deep text-cream"
                          : "border-deep/15 bg-sage/30 text-deep hover:border-deep/40"
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

            <div className="flex flex-col gap-5">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-deep/70">
                  Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 min-h-12 w-full border border-deep/20 bg-cream px-4 text-deep outline-none transition-colors placeholder:text-deep/40 focus:border-deep"
                  autoComplete="name"
                  placeholder="Alex Rivera"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-deep/70">
                  Work email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 min-h-12 w-full border border-deep/20 bg-cream px-4 text-deep outline-none transition-colors placeholder:text-deep/40 focus:border-deep"
                  autoComplete="email"
                  placeholder="alex@company.com"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-deep/70">
                  Project note
                </span>
                <textarea
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none border border-deep/20 bg-cream px-4 py-3 text-deep outline-none transition-colors placeholder:text-deep/40 focus:border-deep"
                  placeholder="What are you building?"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 inline-flex min-h-12 items-center justify-center bg-deep px-6 text-base font-semibold text-cream transition-colors duration-200 hover:bg-deep/90 disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Scheduling…" : "Confirm booking"}
              </button>

              <p className="font-mono text-[11px] leading-relaxed tracking-wide text-deep/65">
                {profile.email} · {profile.phone} · {profile.location}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
