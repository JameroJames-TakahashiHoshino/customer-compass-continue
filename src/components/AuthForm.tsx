
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Sign in form submission
  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would validate credentials here
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
      toast.success("Signed in successfully!");
      window.location.href = "/dashboard";
    }, 1500);
  };

  // Sign up form submission
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would create an account here
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ name: "New User", email: "new@example.com" }));
      toast.success("Account created successfully!");
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <Tabs defaultValue="signin" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      {/* Sign In Form */}
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 text-xs text-primary" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      
      {/* Sign Up Form */}
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Enter your information to create a new account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AuthForm;
