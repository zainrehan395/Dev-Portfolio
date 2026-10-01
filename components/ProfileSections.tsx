"use client";

import { SKILLS, EDUCATION, SITE_CONFIG } from "@/lib/config";
import { motion, useReducedMotion } from "motion/react";

export function SkillsSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28"
    >
      <h2
        id="skills-heading"
        className="text-[clamp(2rem,8vw,3.25rem)] md:text-5xl font-bold tracking-tighter text-white leading-none mb-10 md:mb-14"
      >
        Skills I use every week
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {SKILLS.map((group, i) => (
          <motion.li
            key={group.category}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.55,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="border-t border-white/10 pt-5"
          >
            <h3 className="font-mono text-xs text-brand tracking-wide mb-4">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-sm text-white/75 bg-white/[0.03] border border-white/8 px-2.5 py-1.5 rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function EducationSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24"
    >
      <h2
        id="education-heading"
        className="text-[clamp(2rem,8vw,3.25rem)] md:text-5xl font-bold tracking-tighter text-white leading-none mb-10 md:mb-14"
      >
        Education
      </h2>

      <ol className="space-y-0 divide-y divide-white/10 border-y border-white/10">
        {EDUCATION.map((item, i) => (
          <motion.li
            key={item.degree}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 py-6 md:py-8"
          >
            <span className="block md:col-span-3 font-mono text-xs text-white/40 tracking-wide order-1">
              {item.period}
            </span>
            <div className="md:col-span-6 order-2">
              <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                {item.degree}
              </h3>
              <p className="mt-1 text-sm text-white/55">{item.institution}</p>
            </div>
            <span className="md:col-span-3 md:text-right font-mono text-[11px] text-brand/70 uppercase tracking-wider self-start md:self-center order-3">
              {item.note}
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative w-full border-t border-white/8 bg-[#0a0d0b]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Let&apos;s build
            <br />
            something solid
          </h2>
          <p className="mt-4 max-w-md text-sm md:text-base text-white/50 leading-relaxed">
            Open to full-stack roles and product engineering work. Reach out
            for collaborations, interviews, or a quick intro call.
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono text-sm">
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-brand hover:text-brand/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand min-h-6"
          >
            {SITE_CONFIG.email}
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand min-h-6"
          >
            {SITE_CONFIG.phone}
          </a>
          <a
            href={SITE_CONFIG.resumePath}
            download
            className="text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand min-h-6"
          >
            Download resume
          </a>
          <p className="text-white/30 text-xs mt-2">{SITE_CONFIG.location}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row justify-between gap-3 text-[10px] font-mono uppercase tracking-widest text-white/25">
        <span>
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
