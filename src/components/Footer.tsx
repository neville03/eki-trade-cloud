import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">EKI</h3>
            <p className="text-white/80 mb-4">
              Where Local Meets Digital. A trusted global marketplace connecting people and businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">For Buyers</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Browse Marketplace</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Buyer Protection</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">For Vendors</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/signup/vendor" className="hover:text-white transition-colors">Sign Up as Vendor</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Vendor Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing & Fees</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p>© 2025 EKI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:support@eki.com" className="hover:text-white transition-colors">
              support@eki.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
