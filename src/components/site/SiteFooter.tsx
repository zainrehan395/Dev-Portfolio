import { profile } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-ink">
            {profile.fullName}
          </p>
          <p className="mt-1 text-sm text-muted">{profile.role}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-soft sm:items-end">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-accent"
          >
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="transition-colors hover:text-accent"
          >
            {profile.phone}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <p className="text-muted">{profile.location}</p>
        </div>
      </div>
    </footer>
  );
}
