import { Layout } from "@/components/layout/Layout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SolutionsSection } from "@/components/home/SolutionsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroCarousel />
      <SolutionsSection />
      <AboutSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
