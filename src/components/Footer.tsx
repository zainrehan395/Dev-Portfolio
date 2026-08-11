import { profile } from "@/lib/data";
import ShinyText from "@/components/ShinyText";

export function Footer() {
  return (
    <footer className="border-t border-line bg-deep pt-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-cream">
            {profile.fullName}
          </p>
          <p className="mt-1 text-sage">{profile.role}</p>
          <p className="mt-2 max-w-md text-sm text-cream/70">{profile.education}</p>
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-sage">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-cream"
          >
            Email
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="transition-colors hover:text-cream"
          >
            Call
          </a>
          <a href="#work" className="transition-colors hover:text-cream">
            Experience
          </a>
          <a href="#book" className="transition-colors hover:text-cream">
            Book
          </a>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage/70">
          © {new Date().getFullYear()} {profile.fullName}. Built with care.
        </p>
      </div>

      <div
        id="name-mark"
        className="name-mark relative z-[60] overflow-hidden bg-deep px-2 pb-4 pt-6 text-center sm:pb-5 sm:pt-8"
        aria-hidden="true"
      >
        <ShinyText
          text="ZAIN-UL-ABIDEEN"
          speed={3}
          delay={0.8}
          color="#66726b"
          shineColor="#e6eae7"
          spread={110}
          direction="left"
          className="font-display text-[clamp(1.75rem,10vw,8.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
        />
      </div>
    </footer>
  );
}
