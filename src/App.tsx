
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import IndexPage from "@/pages/Index";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import { DefaultLayoutWrapper } from "@/layouts/DefaultLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "@/components/ui/sonner";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import Payments from "@/pages/Payments";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import AddCustomer from "@/pages/AddCustomer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="w-full">
          <Toaster />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route 
              element={
                <NotificationProvider>
                  <DefaultLayoutWrapper>
                    <AuthProvider>
                      <DashboardLayout />
                    </AuthProvider>
                  </DefaultLayoutWrapper>
                </NotificationProvider>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
