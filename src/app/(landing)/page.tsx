import HeroSection from "@/components/landing/sections/HeroSection";
import FeatureSection from "@/components/landing/sections/FeatureSection";
import FadoSection from "@/components/landing/sections/FadoSection";
import MenuSection from "@/components/landing/menu/MenuSection";
import CustomerReview from "@/components/landing/sections/CustomerReview";
import AlfamaExperience from "@/components/landing/sections/AlfamaExperience";
import TasteOfPortugalSection from "@/components/landing/sections/TasteOfPortugalSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TasteOfPortugalSection />
      <FeatureSection />
      <FadoSection />
      <AlfamaExperience />
      <CustomerReview />
      <MenuSection />
    </>
  );
}
