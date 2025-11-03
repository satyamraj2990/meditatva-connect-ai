import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Building2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";
  
  const [role, setRole] = useState<"patient" | "pharmacy">(initialRole as "patient" | "pharmacy");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo credentials validation
    const validCredentials = {
      patient: { email: "patient@meditatva.com", password: "patient123" },
      pharmacy: { email: "pharmacy@meditatva.com", password: "pharmacy123" },
    };

    if (
      email === validCredentials[role].email &&
      password === validCredentials[role].password
    ) {
      toast.success(`Welcome back! Logging in as ${role}...`);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
      
      setTimeout(() => {
        navigate(role === "patient" ? "/patient/dashboard" : "/pharmacy/dashboard");
      }, 500);
    } else {
      toast.error("Invalid credentials. Use demo credentials from the landing page.");
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md p-8 animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignup ? "Sign up to get started" : "Login to continue"}
          </p>
        </div>

        <Tabs value={role} onValueChange={(value) => setRole(value as "patient" | "pharmacy")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Pharmacy
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={role === "patient" ? "patient@meditatva.com" : "pharmacy@meditatva.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={role === "patient" ? "patient123" : "pharmacy123"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full btn-gradient">
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
            <p className="font-semibold mb-2">Patient Login:</p>
            <p className="text-xs text-muted-foreground">
              Email: patient@meditatva.com<br />
              Password: patient123
            </p>
            <p className="font-semibold mt-4 mb-2">Pharmacy Login:</p>
            <p className="text-xs text-muted-foreground">
              Email: pharmacy@meditatva.com<br />
              Password: pharmacy123
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-primary hover:underline"
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
