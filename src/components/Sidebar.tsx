
import { NavLink } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, PieChart, Settings, Mail, Calendar, HelpCircle, CreditCard, Table, Receipt } from "lucide-react";

export function Sidebar() {
  return (
    <SidebarContainer className="mt-14"> {/* Added margin-top to push sidebar below header */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/customers"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span>Customers</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/customers-table"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Table className="h-4 w-4 mr-2" />
                    <span>Customers Table</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/calendar"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Calendar</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/messages"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Messages</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/analytics"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    <span>Analytics</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/payments"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Payments</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/sales"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    <span>Sales</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/help"
                    className={({ isActive }) => isActive ? "text-primary" : ""}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help &amp; Support</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-2 px-4">
        <div className="text-xs text-muted-foreground">
          <p>ClientChronicle v1.0</p>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
