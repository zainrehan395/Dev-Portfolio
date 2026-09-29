import { SiteNav } from "@/components/site/SiteNav";
import { HeroSection } from "@/components/site/HeroSection";
import { ManifestoStrip } from "@/components/site/ManifestoStrip";
import { StackMarquee } from "@/components/site/StackMarquee";
import { SelectedWork } from "@/components/site/SelectedWork";
import { ProjectsIndex } from "@/components/site/ProjectsIndex";
import { CraftLabLazy } from "@/components/site/CraftLabLazy";
import { SignalMap } from "@/components/site/SignalMap";
import { ProcessChapter } from "@/components/site/ProcessChapter";
import { ContactBook } from "@/components/site/ContactBook";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EntryCurtain } from "@/components/site/EntryCurtain";
import { ScrollRoot } from "@/components/site/ScrollRoot";
import { CursorSystem } from "@/components/site/CursorSystem";
import { ScrollProgress } from "@/components/site/ScrollProgress";

export default function Home() {
  return (
    <ScrollRoot>
      <EntryCurtain />
      <CursorSystem />
      <ScrollProgress />
      <SiteNav />
      <main className="flex-1">
        <HeroSection />
        <StackMarquee />
        <ManifestoStrip />
        <SelectedWork />
        <ProjectsIndex />
        <CraftLabLazy />
        <SignalMap />
        <ProcessChapter />
        <ContactBook />
      </main>
      <SiteFooter />
    </ScrollRoot>
  );
}
