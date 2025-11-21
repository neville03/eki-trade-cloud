import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/Button"; // Import your reusable Button component

// Import your tab page components (create these in /pages/)
import DashboardOverview from "./DashboardOverviewPage";
import UsersPage from "./UsersPage";
import FeedbackPage from "./FeedbackPage";
import ProductsPage from "./ProductsPage";
import OrdersPage from "./OrdersPage";
// add other tabs as needed

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  is_featured?: boolean;
  created_at?: string;
};
type Order = {
  id: string;
  total_price: number;
  status: string;
  created_at?: string;
  customer_id?: string;
  product_id?: string;
  vendor_id?: string;
};

const navigationTabs = [
  "Dashboard",
  "Users",
  "Feedback",
  "Products",
  "Orders",

];

const VendorDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return navigate("/auth?mode=login");

      // Check for vendor role
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!role || role.role !== "vendor") {
        toast.error("Access denied. Vendor account required.");
        return navigate("/");
      }
      // Vendor profile
      const { data: profile } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setVendorProfile(profile);

      // Products
      const { data: productList } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      setProducts(productList || []);

      // Orders
      const { data: orderList } = await supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(orderList || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load dashboard");
    }
    setLoading(false);
  };

  const dashboardStats = useMemo(() => {
    const totalSales = orders.reduce((s, o) => s + Number(o.total_price || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "completed").length;
    const avgOrderValue = orders.length ? totalSales / orders.length : 0;

    return {
      totalSales,
      pendingOrders,
      feedback: 0, // hook up feedback count as needed
      products: products.length,
      avgOrderValue,
      avgProductRating: 4.7,
      responseRate: 0,
      totalReviews: 3,
      completedOrders,
    };
  }, [orders, products]);

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-semibold">Loading dashboard...</div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-xl">Vendor Dashboard</span>
          <nav className="flex gap-4">
            {navigationTabs.map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 rounded font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            {dashboardStats.pendingOrders > 0 && (
              <span className="ml-[-30px] text-xs text-red-500 font-semibold">
                {dashboardStats.pendingOrders}
              </span>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{vendorProfile?.email ?? "Vendor"}</span>
          <Button
            onClick={() =>
              supabase.auth.signOut().then(() => navigate("/"))
            }
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto flex-1 flex gap-6 pt-8 px-4">
        <div className="flex-1 space-y-8">
          {activeTab === "Dashboard" && (
            <DashboardOverview stats={dashboardStats} orders={orders} />
          )}
          {activeTab === "Users" && <UsersPage />}
          {activeTab === "Feedback" && <FeedbackPage />}
          {activeTab === "Products" && <ProductsPage />}
          {activeTab === "Orders" && <OrdersPage />}
          {/* Add other tabs here */}
        </div>
        {/* Sidebar Quick Stats */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded shadow py-6 px-5">
            <div className="font-semibold mb-3">Quick Stats</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Order Value</span>
                <span>
                  UGX {dashboardStats.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Response Rate</span>
                <span>{dashboardStats.responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Product Rating</span>
                <span>{dashboardStats.avgProductRating} ★</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Reviews</span>
                <span>{dashboardStats.totalReviews}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default VendorDashboard;
