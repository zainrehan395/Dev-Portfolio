"use client";

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
    icon: <HomeIcon className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#top",
  },
  {
    title: "Experience",
    icon: <Briefcase className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#work",
  },
  {
    title: "Depth",
    icon: <Orbit className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#depth",
  },
  {
    title: "Skills",
    icon: <Layers3 className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#skills",
  },
  {
    title: "Process",
    icon: <Workflow className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#process",
  },
  {
    title: "Book",
    icon: <Calendar className="h-full w-full text-deep" strokeWidth={1.75} />,
    href: "#book",
  },
];

export function Nav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-5">
      <div className="pointer-events-auto w-max max-w-full">
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
