import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth({ role = "customer" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SIGN UP
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const user = data.user;

    // Insert role into Supabase
    await supabase.from("roles").insert({
      user_id: user.id,
      role: role, // "vendor" or "customer"
    });

    toast.success("Account created!");

    if (role === "vendor") {
      navigate("/vendor/dashboard");
    } else {
      navigate("/marketplace");
    }
  };

  // SIGN IN
  const handleSignin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    // Fetch role
    const { data: userRole } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    const role = userRole?.role;

    if (role === "vendor") {
      navigate("/vendor/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">
        {role === "vendor" ? "Vendor Sign Up / Login" : "Sign Up / Login"}
      </h2>

      <div className="w-full max-w-md space-y-4">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />

        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex space-x-2">
          <Button onClick={handleSignup} className="w-full">
            Sign Up
          </Button>
          <Button variant="outline" onClick={handleSignin} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
