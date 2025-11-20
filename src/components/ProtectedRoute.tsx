import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedProps) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole("none");
        setLoading(false);
        return;
      }

      const { data: userRole, error } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !userRole) {
        setRole("none");
      } else {
        setRole(userRole.role);
      }

      setLoading(false);
    }

    fetchRole();
  }, []);

  if (loading) return null;

  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
}
