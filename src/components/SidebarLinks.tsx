
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Table, 
  Calendar, 
  Settings, 
  LineChart 
} from "lucide-react";

const SidebarLinks = () => {
  const location = useLocation();
  
  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: "/customers",
      label: "Customers",
      icon: <Users className="h-5 w-5" />
    },
    {
      href: "/customers-table",
      label: "Customers Table",
      icon: <Table className="h-5 w-5" />
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            location.pathname === link.href 
              ? "bg-accent text-accent-foreground" 
              : "transparent"
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default SidebarLinks;
