import { Button } from "@/components/ui/button";
import { ArrowRight, Store, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-primary via-navy-light to-navy-lighter overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Where Local Meets Digital
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in [animation-delay:0.1s]">
            Global Digital
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-silver-light to-white">
              Marketplace
            </span>
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]">
            Buy Smart. Sell Fast. Grow Together. A trusted platform connecting people and businesses through seamless trade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.3s]">
            <Link to="/marketplace">
              <Button size="lg" className="group bg-white text-primary hover:bg-white/90 px-8 h-14 text-lg shadow-elegant">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link to="/signup/vendor">
              <Button size="lg" variant="outline" className="group border-2 border-white text-white hover:bg-white hover:text-primary px-8 h-14 text-lg">
                <Store className="mr-2 h-5 w-5" />
                Sign Up as Vendor
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-white/80 text-sm animate-fade-in [animation-delay:0.4s]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};
