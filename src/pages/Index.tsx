import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { VendorCTA } from "@/components/VendorCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <Hero />
      <Features />
      <VendorCTA />
      <Footer />
    </div>
  );
};

export default Index;
