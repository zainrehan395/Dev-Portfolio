"use client";

import dynamic from "next/dynamic";

const CraftLab = dynamic(
  () => import("@/components/site/CraftLab").then((m) => m.CraftLab),
  {
    ssr: false,
    loading: () => (
      <section
        id="craft"
        className="section-pad border-t border-line bg-void"
        aria-label="Craft and stack"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="relative h-[min(60vh,520px)] overflow-hidden border border-line bg-void-lift">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="telemetry text-accent">Loading systems</p>
            </div>
          </div>
        </div>
      </section>
    ),
  },
);

export function CraftLabLazy() {
  return <CraftLab />;
}
