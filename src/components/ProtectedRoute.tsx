import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
          setRole("none");
          setLoading(false);
          return;
        }

        const { data: userRole, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching role:", error.message);
          setRole("none");
        } else {
          setRole(userRole?.role || "none");
        }
      } catch (err) {
        console.error("ProtectedRoute error:", err);
        setRole("none");
      } finally {
        setLoading(false);
      }
    }

    loadRole();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
