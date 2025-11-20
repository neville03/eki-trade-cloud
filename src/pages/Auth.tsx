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
    if (!email || !password) return alert("Enter email and password");

    try {
      let data, error;

      if (mode === "signup") {
        // SIGN UP
        ({ data, error } = await supabase.auth.signUp({ email, password }));
        if (error) return alert(error.message);

        const user = data.user;
        if (!user) return alert("Failed to create user");

        // Assign vendor role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: user.id,
          role: "vendor",
        });
        if (roleError) return alert("Failed to assign vendor role: " + roleError.message);
      } else {
        // LOGIN
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
        if (error) return alert(error.message);
      }

      // Wait for session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) return alert("Session not ready. Try again.");

      const user = sessionData.session.user;

      // Fetch role from user_roles
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!userRole || userRole.role !== "vendor") {
        return alert("Access denied. Vendor account required.");
      }

      // SUCCESS - redirect to vendor dashboard
      navigate("/vendor/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
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
