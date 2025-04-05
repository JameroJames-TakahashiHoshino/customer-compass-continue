
import { Home, CreditCard, Users, Settings, Table, Receipt } from "lucide-react";
import { SidebarItem } from "./Sidebar";

export function SidebarLinks() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Dashboard
        </h2>
        <div className="space-y-1">
          <SidebarItem to="/dashboard" title="Overview" icon={Home} />
          <SidebarItem to="/customers" title="Customers" icon={Users} />
          <SidebarItem to="/customers-table" title="Customers Table" icon={Table} />
          <SidebarItem to="/payments" title="Payments" icon={CreditCard} />
          <SidebarItem to="/sales" title="Sales" icon={Receipt} />
          <SidebarItem to="/settings" title="Settings" icon={Settings} />
        </div>
      </div>
    </div>
  )
}
