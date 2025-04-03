
import AuthForm from "@/components/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <div className="w-full max-w-md px-4 mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">ClientChronicle</h1>
          <p className="text-muted-foreground mt-2">Manage your clients with ease</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;

