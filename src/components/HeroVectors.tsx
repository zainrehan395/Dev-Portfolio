import type { CSSProperties } from "react";

/**
 * Soft frosted-glass vector discs matching the reference composition:
 * bottom-left mass, tall orb behind the card, far-right satellites.
 */
export function HeroVectors() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 52% 44% at 5% 85%, rgb(102 114 107 / 0.16), transparent 70%)",
            "radial-gradient(ellipse 36% 32% at 92% 12%, rgb(230 234 231 / 0.04), transparent 68%)",
          ].join(", "),
        }}
      />

      <GlassOrb
        className="hero-orb hero-orb--a -bottom-[24%] -left-[16%] size-[min(78vw,680px)]"
        blur={52}
        intensity={0.95}
      />

      <GlassOrb
        className="hero-orb hero-orb--b -right-[2%] top-[-4%] hidden h-[min(92vh,820px)] w-[min(48vw,440px)] sm:block lg:right-[4%]"
        blur={56}
        intensity={1}
        highlight="34% 24%"
      />

      <GlassOrb
        className="hero-orb hero-orb--c -right-[8%] top-[16%] hidden size-[min(44vw,400px)] sm:block lg:right-0"
        blur={44}
        intensity={0.88}
        highlight="42% 30%"
      />

      <GlassOrb
        className="hero-orb hero-orb--c -right-[6%] top-[-6%] size-[min(28vw,260px)]"
        blur={36}
        intensity={0.7}
        highlight="40% 34%"
      />

      <GlassOrb
        className="hero-orb hero-orb--d -right-[10%] top-[48%] size-[min(34vw,320px)]"
        blur={40}
        intensity={0.78}
        highlight="44% 36%"
      />

      <GlassOrb
        className="hero-orb hero-orb--d bottom-[4%] right-[18%] size-[min(36vw,340px)]"
        blur={50}
        intensity={0.55}
        highlight="48% 42%"
      />
    </div>
  );
}

function GlassOrb({
  className,
  blur,
  intensity = 1,
  highlight = "32% 28%",
}: {
  className: string;
  blur: number;
  intensity?: number;
  highlight?: string;
}) {
  const style: CSSProperties = {
    opacity: intensity,
    borderRadius: "50%",
    filter: `blur(${blur}px)`,
    mixBlendMode: "screen",
    background: [
      `radial-gradient(circle at ${highlight},
        rgb(230 234 231 / 0.55) 0%,
        rgb(214 220 216 / 0.32) 22%,
        rgb(166 176 170 / 0.16) 45%,
        rgb(102 114 107 / 0.06) 62%,
        transparent 76%)`,
    ].join(", "),
  };

  return <div className={`absolute ${className}`} style={style} />;
}
