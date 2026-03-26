import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Integration } from "@/components/landing/Integration";
import { Features } from "@/components/landing/Features";
import { UseCases } from "@/components/landing/UseCases";
import { Transparency } from "@/components/landing/Transparency";
import { Steps } from "@/components/landing/Steps";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white noise-texture font-sans">
      <Navbar />
      <main>
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
