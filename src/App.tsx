
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/index" replace />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route element={<DefaultLayout />}>
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
    </Router>
  );
}

export default App;
