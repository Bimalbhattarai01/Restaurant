import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import FadoSection from "@/components/landing/FadoSection";
import MenuSection from "@/components/landing/MenuSection";
import CustomerReview from "@/components/landing/CustomerReview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <FadoSection />
      <CustomerReview />
      <MenuSection />
    </>
  );
}
