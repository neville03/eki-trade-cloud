import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const user = session.user;

      const { data: profile } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setVendorProfile(profile);

      const { data: productList } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      setProducts(productList || []);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
      <p className="mt-2 opacity-70">
        Welcome, {vendorProfile?.business_name || "Vendor"}.
      </p>

      <Button
        className="mt-4"
        onClick={() =>
          supabase.auth.signOut().then(() => window.location.href = "/auth")
        }
      >
        Log Out
      </Button>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your Products</h2>
      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4">
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="mt-2 text-sm opacity-70">Price: ${p.price}</p>
          </div>
        ))}
        {products.length === 0 && <div className="opacity-60">No products yet.</div>}
      </div>
    </div>
  );
};

export default VendorDashboard;
