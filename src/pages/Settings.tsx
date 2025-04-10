
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  // Load the current theme
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setDarkMode(theme === 'dark');
    
    // Set default theme if not set
    if (!theme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleSaveGeneralSettings = () => {
    setLoading(true);
    
    // Save theme setting (already handled in handleThemeChange)
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 800);
  };

  const handleSaveNotificationSettings = () => {
    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      toast.success("Notification preferences saved");
    }, 800);
  };
  
  const handleSaveDisplaySettings = () => {
    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      toast.success("Display settings saved successfully");
    }, 800);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch 
                  id="theme" 
                  checked={darkMode} 
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveGeneralSettings} 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how dates and times are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format" className="dark:text-foreground">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="MMMM D, YYYY">MMMM D, YYYY</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how dates appear throughout the application
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-format" className="dark:text-foreground">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (e.g., 2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (e.g., 14:30)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how times appear throughout the application
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency-symbol">Currency Symbol</Label>
                <Select defaultValue="USD">
                  <SelectTrigger id="currency-symbol" className="dark:text-foreground">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">$ (USD)</SelectItem>
                    <SelectItem value="EUR">€ (EUR)</SelectItem>
                    <SelectItem value="GBP">£ (GBP)</SelectItem>
                    <SelectItem value="JPY">¥ (JPY)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose the default currency for the application
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveDisplaySettings} 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Display Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-sales">New Sales</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new sale is created
                  </p>
                </div>
                <Switch id="new-sales" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-payments">New Payments</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new payment is received
                  </p>
                </div>
                <Switch id="new-payments" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveNotificationSettings} 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with two-factor authentication
                  </p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="space-y-2">
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
