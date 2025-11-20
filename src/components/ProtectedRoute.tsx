import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      // wait for auth state change first
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setRole("none");
        setLoading(false);
        return;
      }

      const user = session.user;

      // fetch role
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      // wait if role is not yet available
      if (!userRole) {
        // optional: small delay, retry
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { data: retryRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        setRole(retryRole?.role || "none");
      } else {
        setRole(userRole.role);
      }

      setLoading(false);
    }

    loadRole();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
