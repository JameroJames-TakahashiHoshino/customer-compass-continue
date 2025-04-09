
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { Shield } from "lucide-react";

export default function IndexPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">CRM Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">Manage your customers and transactions</p>
        </div>
        
        <AuthForm />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Are you an administrator?</p>
          <Button variant="outline" asChild className="w-full">
            <Link to="/admin-login">
              <Shield className="mr-2 h-4 w-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
