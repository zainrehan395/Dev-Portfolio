import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { ScrollTunnel } from "@/components/ScrollTunnel";
import { Skills } from "@/components/Skills";
import { Process } from "@/components/Process";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { ScrollProvider } from "@/components/ScrollProvider";
import { Intro } from "@/components/Intro";

export default function Home() {
  return (
    <ScrollProvider>
      <Intro />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Work />
        <ScrollTunnel />
        <Skills />
        <Process />
        <Booking />
      </main>
      <Footer />
    </ScrollProvider>
  );
}
