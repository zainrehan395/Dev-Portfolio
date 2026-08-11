"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  Layers3,
  HomeIcon,
  Orbit,
  Workflow,
} from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";

const data = [
  {
    title: "Home",
    icon: <HomeIcon className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#top",
  },
  {
    title: "Experience",
    icon: <Briefcase className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#work",
  },
  {
    title: "Depth",
    icon: <Orbit className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#depth",
  },
  {
    title: "Skills",
    icon: <Layers3 className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#skills",
  },
  {
    title: "Process",
    icon: <Workflow className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#process",
  },
  {
    title: "Book",
    icon: <Calendar className="h-full w-full text-cream" strokeWidth={1.75} />,
    href: "#book",
  },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mark = document.getElementById("name-mark");
    if (!mark) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { root: null, threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 transition-[opacity,transform,visibility] duration-300 ease-out sm:bottom-5 ${
        hidden
          ? "invisible translate-y-4 opacity-0"
          : "visible translate-y-0 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <div className={`w-max max-w-full ${hidden ? "pointer-events-none" : "pointer-events-auto"}`}>
        <Dock
          panelHeight={56}
          magnification={68}
          className="liquid-glass"
        >
          {data.map((item) => (
            <DockItem
              key={item.title}
              className="liquid-glass-item rounded-full"
              onClick={() => {
                const el = document.querySelector(item.href);
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>
    </div>
  );
}
