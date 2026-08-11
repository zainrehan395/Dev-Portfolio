import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line bg-deep py-12 pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-cream">
            {profile.fullName}
          </p>
          <p className="mt-1 text-muted">{profile.role}</p>
          <p className="mt-2 max-w-md text-sm text-cream/70">{profile.education}</p>
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
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
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70">
          © {new Date().getFullYear()} {profile.fullName}. Built with care.
        </p>
      </div>
    </footer>
  );
}
