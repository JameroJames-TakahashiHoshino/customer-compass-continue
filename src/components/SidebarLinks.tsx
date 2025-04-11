
import { 
  Home, 
  CreditCard, 
  Users, 
  Settings, 
  Receipt, 
  HelpCircle, 
  Calendar, 
  Mail, 
  PieChart,
  LayoutDashboard
} from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { NavLink } from "react-router-dom";

export function SidebarLinks() {
  return (
    <div className="space-y-4 py-4">
      {/* Main Navigation */}
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Main
        </h2>
        <div className="space-y-1">
          <SidebarItem to="/dashboard" title="Dashboard" icon={LayoutDashboard} />
          <SidebarItem to="/customers" title="Customers" icon={Users} />
          <SidebarItem to="/calendar" title="Calendar" icon={Calendar} />
          <SidebarItem to="/messages" title="Messages" icon={Mail} />
          <SidebarItem to="/analytics" title="Analytics" icon={PieChart} />
          <SidebarItem to="/payments" title="Payments" icon={CreditCard} />
          <SidebarItem to="/sales" title="Sales" icon={Receipt} />
        </div>
      </div>

      {/* System Navigation */}
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          System
        </h2>
        <div className="space-y-1">
          <SidebarItem to="/help" title="Help & Support" icon={HelpCircle} />
          <SidebarItem to="/settings" title="Settings" icon={Settings} />
        </div>
      </div>
    </div>
  )
}

// Create a SidebarItem component that uses the sidebar components
function SidebarItem({ to, title, icon: Icon }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={to}
          className={({ isActive }) => isActive ? "text-primary" : ""}
        >
          <Icon className="h-4 w-4 mr-2" />
          <span>{title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
