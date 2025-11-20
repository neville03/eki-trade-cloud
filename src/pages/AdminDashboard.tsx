import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Store, ShoppingBag, LogOut, Check, X } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user is an admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast.error("Access denied. Admin account required.");
      navigate("/");
      return;
    }

    await fetchData();
  };

  const fetchData = async () => {
    // Fetch pending vendors
    const { data: vendors } = await supabase
      .from("vendor_profiles")
      .select(`
        *,
        profiles(full_name)
      `)
      .eq("is_approved", false)
      .order("created_at", { ascending: false });

    setPendingVendors(vendors || []);

    // Fetch stats
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: vendorCount } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "vendor");

    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    setStats({
      totalUsers: userCount || 0,
      totalVendors: vendorCount || 0,
      totalProducts: productCount || 0,
    });

    setLoading(false);
  };

  const handleApproveVendor = async (vendorId: string, userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase
      .from("vendor_profiles")
      .update({
        is_approved: true,
        approved_at: new Date().toISOString(),
        approved_by: session?.user.id,
        verification_status: "approved",
      })
      .eq("id", vendorId);

    if (error) {
      toast.error("Failed to approve vendor");
    } else {
      toast.success("Vendor approved successfully!");
      fetchData();
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    const { error } = await supabase
      .from("vendor_profiles")
      .update({
        verification_status: "rejected",
      })
      .eq("id", vendorId);

    if (error) {
      toast.error("Failed to reject vendor");
    } else {
      toast.success("Vendor rejected");
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EKI Admin Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Vendor Approvals</CardTitle>
            <CardDescription>Review and approve vendor registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingVendors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending vendor approvals
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{vendor.business_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Owner: {vendor.profiles?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Type: {vendor.business_type || "Not specified"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.business_description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApproveVendor(vendor.id, vendor.user_id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRejectVendor(vendor.id)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
