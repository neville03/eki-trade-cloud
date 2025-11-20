import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole("none");
        setLoading(false);
        return;
      }

      const { data: userRole } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(userRole?.role || "none");
      setLoading(false);
    }

    loadRole();
  }, []);

  if (loading) return null;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}
