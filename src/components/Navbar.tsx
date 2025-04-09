
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
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get recent sales
      const { data: recentSales, error: salesError } = await supabase
        .from('sales')
        .select(`
          transno, 
          salesdate,
          customer:custno (custname)
        `)
        .order('salesdate', { ascending: false })
        .limit(1);
        
      if (salesError) throw salesError;
      
      // Get recent payments
      const { data: recentPayments, error: paymentsError } = await supabase
        .from('payment')
        .select(`
          orno, 
          paydate, 
          amount, 
          transno,
          sales:transno (
            customer:custno (custname)
          )
        `)
        .order('paydate', { ascending: false })
        .limit(2);
        
      if (paymentsError) throw paymentsError;
      
      // Combine and format notifications
      const notificationItems = [
        ...recentSales.map((sale: any) => ({
          id: `sale-${sale.transno}`,
          title: 'New sale created',
          description: `Sale #${sale.transno} with ${sale.customer?.custname || 'customer'}`,
          time: sale.salesdate ? new Date(sale.salesdate).toLocaleDateString() : 'recent',
          type: 'sale'
        })),
        ...recentPayments.map((payment: any) => ({
          id: `payment-${payment.orno}`,
          title: 'Payment received',
          description: `${payment.amount ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(payment.amount) : 'Payment'} for transaction #${payment.transno || ''} from ${payment.sales?.customer?.custname || 'customer'}`,
          time: payment.paydate ? new Date(payment.paydate).toLocaleDateString() : 'recent',
          type: 'payment'
        }))
      ];
      
      setNotifications(notificationItems);
      setNotificationCount(notificationItems.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };
  
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
    // Mark notifications as viewed
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
                
                {loading ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className="border-t pt-2">
                      <div className="text-sm">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
                )}
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
