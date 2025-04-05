
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  LogOut,
  Menu,
  Settings,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useMobile } from "@/hooks/use-mobile";
import { Session } from "@supabase/supabase-js";

// Admin credentials - in a real app these would be stored in a database
const ADMIN_EMAILS = ["admin@example.com", "superadmin@example.com"];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [session, setSession] = useState<Session | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUserEmail(data.session.user.email || "");
        setIsAdmin(ADMIN_EMAILS.includes(data.session.user.email || ""));
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserEmail(session.user.email || "");
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ""));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/customers") return "Customers";
    if (path === "/customers-table") return "Customers Table";
    if (path === "/payments") return "Payments";
    if (path === "/sales") return "Sales";
    if (path.startsWith("/customers/")) return "Customer Details";
    return "Dashboard";
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Error signing out");
      return;
    }
    
    toast.success("Signed out successfully");
    navigate("/");
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
    toast.success("All notifications marked as read");
  };

  if (!session) {
    return null;
  }

  const userInitials = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <div className="font-bold mr-6 text-xl">{getPageTitle()}</div>
        </div>
        <Button variant="outline" size="icon" className="mr-2 md:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {isMobile && <div className="font-bold">{getPageTitle()}</div>}
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600">
                      <span className="sr-only">{unreadNotifications} unread notifications</span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-medium">Notifications</h4>
                  {unreadNotifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="max-h-[calc(var(--radix-popover-content-available-height)-80px)] overflow-y-auto">
                  <div className="flex items-start gap-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">New customer registered</p>
                      <p className="text-xs text-muted-foreground">John Smith has created an account</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-3 border-t">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bell className="h-4 w-4 text-primary" />
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">New payment received</p>
                      <p className="text-xs text-muted-foreground">Payment #1234 has been processed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-3 border-t">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Settings className="h-4 w-4 text-primary" />
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">System update</p>
                      <p className="text-xs text-muted-foreground">The application has been updated to version 1.2.0</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    {isAdmin && (
                      <div className="flex items-center mt-1 text-xs text-primary">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Admin Access
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
