import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      // Get session instead of just user
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData?.session?.user;

      if (!user) {
        setRole("none");
        setLoading(false);
        return;
      }

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(userRole?.role || "none");
      setLoading(false);
    }

    loadRole();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!allowedRoles.includes(role)) {
    // redirect unauthorized users to auth page
    return <Navigate to="/auth" replace />;
  }

  return children;
}
