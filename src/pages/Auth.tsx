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
        ({ data, error } = await supabase.auth.signUp({ email, password }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      }

      if (error) return alert(error.message);

      // Wait for session initialization
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        return alert("Session not initialized. Try again.");
      }

      const user = sessionData.session.user;

      // assign vendor role if signing up
      if (mode === "signup") {
        await supabase.from("roles").insert({ user_id: user.id, role: "vendor" });
      }

      // fetch role
      const { data: userRole } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!userRole || userRole.role !== "vendor") {
        return alert("Access denied. Vendor account required.");
      }

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
