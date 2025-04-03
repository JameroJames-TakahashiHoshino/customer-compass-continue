
import AuthForm from "@/components/AuthForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        navigate("/dashboard");
      }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
