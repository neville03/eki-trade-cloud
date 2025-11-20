import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    checkVendor();
  }, []);

  const checkVendor = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      navigate("/auth?mode=login&role=vendor");
      return;
    }

    const user = sessionData.session.user;

    // CHECK ROLE
    const { data: role } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!role || role.role !== "vendor") {
      toast.error("Access denied. Vendor account required.");
      navigate("/");
      return;
    }

    // LOAD PROFILE
    const { data: profile } = await supabase
      .from("vendor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setVendorProfile(profile);

    // LOAD PRODUCTS
    const { data: productList } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false });

    setProducts(productList || []);
    setLoading(false);
  };

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
          supabase.auth.signOut().then(() => navigate("/"))
        }
      >
        Log Out
      </Button>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your Products</h2>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-4">
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="mt-2 text-sm opacity-70">
              Price: ${p.price}
            </p>
          </div>
        ))}

        {products.length === 0 && (
          <div className="opacity-60">No products yet.</div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
