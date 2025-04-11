
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ResetPassword from "@/pages/ResetPassword";
import AdminLogin from "@/pages/AdminLogin";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import Payments from "@/pages/Payments";
import CustomerDetail from "@/pages/CustomerDetail";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Help from "@/pages/Help";
import Profile from "@/pages/Profile";
import AddCustomer from "@/pages/AddCustomer";
import Calendar from "@/pages/Calendar";
import Messages from "@/pages/Messages";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import { Toaster } from "@/components/ui/sonner";
import { DefaultLayoutWrapper } from "@/layouts/DefaultLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Auth from "@/pages/Auth";

// Import SalesDetail
import SalesDetail from "@/pages/SalesDetail";

// Check for dark mode
const setInitialTheme = () => {
  // Check if theme is already set in localStorage
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // If no preference set, check user's system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

// Check if a user is logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<null | boolean>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Show loading state
  if (session === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Redirect authenticated users away from auth pages
const UnauthRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<null | boolean>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Show loading state
  if (session === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    setInitialTheme();
  }, []);

  return (
    <Router>
      <NotificationProvider>
        <div className="w-full">
          <Toaster />
          <Routes>
            <Route path="/" element={
              <UnauthRoute>
                <IndexPage />
              </UnauthRoute>
            } />
            <Route path="/auth" element={
              <UnauthRoute>
                <Auth />
              </UnauthRoute>
            } />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/" element={
              <AuthRoute>
                <DefaultLayoutWrapper>
                  <DashboardLayout />
                </DefaultLayoutWrapper>
              </AuthRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/new" element={<AddCustomer />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales-detail/:id" element={<SalesDetail />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/help" element={<Help />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;
