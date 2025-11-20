import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode") || "login";
  const roleFromUrl = params.get("role") || "customer"; // customer | vendor | admin

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isVendor = roleFromUrl === "vendor";
  const isAdmin = roleFromUrl === "admin";

  const handleAuth = async () => {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;
      if (!user) return;

      await supabase.from("roles").insert({
        user_id: user.id,
        role: roleFromUrl, // customer | vendor | admin
      });

      if (isVendor) {
        navigate("/vendor/dashboard");
      } else if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/marketplace");
      }
    } else {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const session = data.session;
      if (!session) return;

      const { data: userRole } = await supabase
        .from("roles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!userRole) return navigate("/marketplace");

      if (userRole.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (userRole.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/marketplace");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "signup"
              ? isVendor
                ? "Vendor Sign Up"
                : "Create Account"
              : "Log In"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? isVendor
                ? "Register to start selling"
                : "Join the marketplace"
              : "Access your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleAuth} className="w-full">
            {mode === "signup" ? "Sign Up" : "Log In"}
          </Button>

          <div className="text-sm text-center mt-3">
            {mode === "signup" ? (
              <Link to={`/auth?mode=login&role=${roleFromUrl}`}>
                Already have an account? Log in
              </Link>
            ) : (
              <Link to={`/auth?mode=signup&role=${roleFromUrl}`}>
                Create an account
              </Link>
            )}
          </div>

          {!isVendor && (
            <div className="text-center text-sm mt-3">
              <Link
                className="underline text-blue-600"
                to="/auth?mode=signup&role=vendor"
              >
                Sign up as a Vendor
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
