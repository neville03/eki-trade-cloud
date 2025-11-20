import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (mode === "signup") {
      // SIGN UP
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

      // assign vendor role
      await supabase.from("roles").insert({
        user_id: user.id,
        role: "vendor",
      });

      navigate("/vendor/dashboard");
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

      // fetch role
      const { data: userRole } = await supabase
        .from("roles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!userRole || userRole.role !== "vendor") {
        alert("Access denied. Vendor account required.");
        return;
      }

      navigate("/vendor/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "signup" ? "Vendor Sign Up" : "Vendor Log In"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Register to start selling"
              : "Access your vendor account"}
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
              <button
                onClick={() => setMode("login")}
                className="underline text-blue-600"
              >
                Already have an account? Log in
              </button>
            ) : (
              <button
                onClick={() => setMode("signup")}
                className="underline text-blue-600"
              >
                Create a vendor account
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
