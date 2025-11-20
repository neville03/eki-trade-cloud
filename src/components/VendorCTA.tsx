import { Button } from "@/components/ui/button";
import { Store, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export const VendorCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-navy-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
            <Store className="w-4 h-4" />
            Join Our Vendor Network
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Selling on EKI Today
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Reach millions of customers, grow your business, and join the future of digital commerce.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <TrendingUp className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Grow Sales</h3>
              <p className="text-white/80 text-sm">Access to global marketplace</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <DollarSign className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Low Fees</h3>
              <p className="text-white/80 text-sm">Competitive commission rates</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <BarChart3 className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-white/80 text-sm">Powerful business insights</p>
            </div>
          </div>

          <Link to="/auth?type=vendor">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-12 h-14 text-lg shadow-elegant">
              <Store className="mr-2 h-5 w-5" />
              Create Vendor Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
