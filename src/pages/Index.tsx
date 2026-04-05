import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import GallerySection from "@/components/landing/GallerySection";
import StatsSection from "@/components/landing/StatsSection";
import QuoteSection from "@/components/landing/QuoteSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <StatsSection />
      <QuoteSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
