
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ResetPassword from "@/pages/ResetPassword";
import AdminLogin from "@/pages/AdminLogin";
import Customers from "@/pages/Customers";
import CustomersTable from "@/pages/CustomersTable";
import Sales from "@/pages/Sales";
import Payments from "@/pages/Payments";
import CustomerDetail from "@/pages/CustomerDetail";
import DefaultLayout from "@/layouts/DefaultLayout";
import Help from "@/pages/Help";

// Protected route that redirects unauthenticated users to index
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public route that redirects authenticated users to dashboard
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="w-full">
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <IndexPage />
            </PublicRoute>
          } />
          <Route path="/index" element={
            <PublicRoute>
              <IndexPage />
            </PublicRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route element={
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers-table" element={<CustomersTable />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
