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
    const loadRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setRole("none");
        setLoading(false);
        return;
      }

      const user = session.user;

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(userRole?.role || "none");
      setLoading(false);
    };

    loadRole();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
