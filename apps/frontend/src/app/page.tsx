import { HeroSection } from "../components/HeroSection";
import { TrustBar } from "../components/TrustBar";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { PromotionsSection } from "../components/PromotionsSection";
import { ServicesSection } from "../components/ServicesSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { ProductsSection } from "../components/ProductsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";

export const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <HowItWorksSection />
      <PromotionsSection />
      <ServicesSection />
      <CategoriesSection />
      <ProductsSection />
      <TestimonialsSection />
    </main>
  );
};
