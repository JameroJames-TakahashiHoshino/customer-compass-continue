
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      // Force navigation to root which will then redirect to login page
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleNotificationClick = () => {
    toast.info("Notifications viewed");
    setNotificationCount(0);
  };

  return (
    <header className="sticky top-0 z-30 bg-background border-b flex h-14 items-center px-4 lg:px-6 w-full">
      <div className="flex items-center w-full gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex">
          <a href="/dashboard" className="font-bold text-lg">ClientChronicle</a>
        </div>
        
        <div className="flex items-center ml-auto gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Notifications</h4>
                <div className="border-t pt-2">
                  <div className="text-sm">
                    <p className="font-medium">New message from client</p>
                    <p className="text-muted-foreground">ABC Company sent you a message</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="text-sm">
                    <p className="font-medium">Payment received</p>
                    <p className="text-muted-foreground">$250.00 from ABC Company</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="text-sm">
                    <p className="font-medium">New transaction</p>
                    <p className="text-muted-foreground">Global Trading Inc. created a new order</p>
                    <p className="text-xs text-muted-foreground mt-1">Tomorrow</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
