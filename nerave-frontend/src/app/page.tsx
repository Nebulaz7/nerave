import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Integration } from "@/components/landing/Integration";
import { Features } from "@/components/landing/Features";
import { UseCases } from "@/components/landing/UseCases";
import { Transparency } from "@/components/landing/Transparency";
import { Steps } from "@/components/landing/Steps";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import Tag from "@/components/landing/Tag";

export default function Home() {
  return (
    <div className="min-h-screen noise-texture font-sans bg-[#f7f6f6] text-[#09090b] selection:bg-[#7c3aed]/20">
      <Navbar />
      <main>
        <Tag />
        <Hero />
        <Integration />
        <Features />
        <UseCases />
        <Transparency />
        <Steps />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
