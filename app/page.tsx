import Hero from "@/components/HeroSection";
import CurvedLoop from "@/components/CurvedLoop";
import ProjectGallery from "@/components/ProjectGallery";
import ExperienceShowcase from "@/components/ExperienceShowcase";
import {
  SkillsSection,
  EducationSection,
  SiteFooter,
} from "@/components/ProfileSections";
import { SITE_CONFIG } from "@/lib/config";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden bg-[#0c0f0d]">
      <Hero />

      <div className="py-4 md:py-6 overflow-hidden border-y border-white/5 bg-[#0c0f0d] touch-pan-y">
        <CurvedLoop
          marqueeText={SITE_CONFIG.marqueeText}
          speed={2.5}
          curveAmount={220}
          interactive={true}
        />
      </div>

      <ExperienceShowcase />
      <SkillsSection />
      <ProjectGallery />
      <EducationSection />
      <SiteFooter />
    </div>
  );
}
