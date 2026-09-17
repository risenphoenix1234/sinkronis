// src/app/page.tsx
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HowItWorksSection from "@/components/landing/Howitworkssection";
import TestimonialSection from "@/components/landing/Testimonialssection";
import Pricing from "@/components/landing/Pricingsection";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <Pricing />
      <Footer />
    </main>
  );
}
