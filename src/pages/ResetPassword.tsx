
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a verified email from the code verification process
    const email = localStorage.getItem('resetVerifiedEmail');
    if (!email) {
      setError("Invalid password reset session. Please request a new one.");
      return;
    }
    
    setVerifiedEmail(email);
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!verifiedEmail) {
      setError("Invalid password reset session. Please request a new one.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // First sign in with the special OTP method to get a session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email: verifiedEmail,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      // Then update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast.success("Password reset successfully");
      
      // Clean up local storage
      localStorage.removeItem(`resetCode_${verifiedEmail}`);
      localStorage.removeItem(`resetEmail_${verifiedEmail}`);
      localStorage.removeItem('resetVerifiedEmail');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">ClientChronicle</h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          {error && (
            <CardContent className="pt-0">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          )}
          
          {success ? (
            <CardContent>
              <Alert>
                <AlertDescription>
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
        
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
