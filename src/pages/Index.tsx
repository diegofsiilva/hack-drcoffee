import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <section id="diagnosis">
          <DiagnosisSection />
        </section>
        <FeaturesSection />
        <section id="results">
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
