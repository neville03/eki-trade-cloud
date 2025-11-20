import { Shield, Zap, Globe, TrendingUp, Lock, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Vendors",
    description: "Every vendor is verified and approved by our team for your safety and trust.",
  },
  {
    icon: Zap,
    title: "Fast Transactions",
    description: "Lightning-fast checkout with multiple payment options for seamless trade.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with buyers and sellers from around the world in one marketplace.",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Powerful analytics and tools to help your business grow and thrive.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description: "Bank-level security protecting your transactions and personal data.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you whenever you need help.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose EKI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for trust, transparency, and economic growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
