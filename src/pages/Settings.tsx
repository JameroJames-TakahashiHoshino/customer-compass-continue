
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    dataRetention: "30 days"
  });

  // Check for dark mode preference on initial load
  useEffect(() => {
    // Check if document has dark class or local storage setting
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                        localStorage.getItem('theme') === 'dark';
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSave = (section: string) => {
    setIsLoading(true);
    
    // If General settings, apply dark mode
    if (section === 'General') {
      toggleDarkMode(darkMode);
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${section} settings saved successfully`);
    }, 1000);
  };
  
  const handleSettingChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => handleSettingChange('timezone', value)}
                >
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                    <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
                    <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select 
                  value={settings.dateFormat} 
                  onValueChange={(value) => handleSettingChange('dateFormat', value)}
                >
                  <SelectTrigger id="date-format" className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="dark-mode">Enable Dark Mode</Label>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => handleSave('General')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all of its data.</p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => handleSave('Account')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive email notifications about important updates</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Customer Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when a new customer is added</p>
                  </div>
                  <Switch id="customer-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
                  </div>
                  <Switch id="payment-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">System Updates</h3>
                    <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                  </div>
                  <Switch id="system-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Communications</h3>
                    <p className="text-sm text-muted-foreground">Receive newsletters and promotional emails</p>
                  </div>
                  <Switch id="marketing-notifications" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => handleSave('Notification')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" defaultValue="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-sm text-muted-foreground">Use this key to access the API programmatically</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-service.com/webhook" />
                <p className="text-sm text-muted-foreground">We'll send event notifications to this URL</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="debug-mode" />
                <Label htmlFor="debug-mode">Enable Debug Mode</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="beta-features" />
                <Label htmlFor="beta-features">Enable Beta Features</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select 
                  value={settings.dataRetention} 
                  onValueChange={(value) => handleSettingChange('dataRetention', value)}
                >
                  <SelectTrigger id="data-retention" className="w-full">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="90 days">90 days</SelectItem>
                    <SelectItem value="180 days">180 days</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                    <SelectItem value="Forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => handleSave('Advanced')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
