import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart } from "lucide-react";

const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299,
    rating: 4.8,
    reviews: 124,
    vendor: "TechStore Global",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    verified: true,
  },
  {
    id: 2,
    name: "Handcrafted Leather Bag",
    price: 189,
    rating: 4.9,
    reviews: 89,
    vendor: "Artisan Crafts",
    location: "Florence, Italy",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    verified: true,
  },
  {
    id: 3,
    name: "Organic Coffee Beans",
    price: 24,
    rating: 4.7,
    reviews: 203,
    vendor: "Fresh Roasters",
    location: "Portland, USA",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
    verified: true,
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    price: 349,
    rating: 4.6,
    reviews: 156,
    vendor: "FitTech Pro",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    verified: true,
  },
  {
    id: 5,
    name: "Designer Sunglasses",
    price: 159,
    rating: 4.8,
    reviews: 92,
    vendor: "Vision Style",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    verified: true,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 129,
    rating: 4.5,
    reviews: 178,
    vendor: "Sound Masters",
    location: "Berlin, Germany",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    verified: true,
  },
];

export default function Marketplace() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Discover Products
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse thousands of verified products from trusted vendors worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  {product.verified && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      Verified
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      ${product.price}
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      by <span className="font-medium text-foreground">{product.vendor}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
