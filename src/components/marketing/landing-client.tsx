 
import { HeroSection } from "@/components/marketing/sections/hero-section";
import { AboutSection } from "@/components/marketing/sections/about-section";
import { FeaturesSection } from "@/components/marketing/sections/features-section";
import { PricingSection } from "@/components/marketing/sections/pricing-section";
import { CtaSection } from "@/components/marketing/sections/cta-section";
import { SiteFooter } from "@/components/marketing/sections/site-footer";

export function LandingClient() {
  return (
    <div className="min-h-screen bg-background text-gray-900 selection:bg-gray-900 selection:text-white">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
