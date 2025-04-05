
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowUpRight, Users, CreditCard, DollarSign, Activity } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [customerCount, setCustomerCount] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch customer count
        const { count: customerCount, error: customerError } = await supabase
          .from("customer")
          .select("*", { count: "exact", head: true });

        if (customerError) throw customerError;
        
        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from("sales")
          .select("*")
          .order("salesdate", { ascending: false })
          .limit(10);

        if (salesError) throw salesError;

        // Fetch payments data
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payment")
          .select("*")
          .order("paydate", { ascending: false })
          .limit(10);

        if (paymentsError) throw paymentsError;

        // Combine recent activity
        const combinedActivity = [
          ...(salesData || []).map(sale => ({
            ...sale,
            type: "sale"
          })),
          ...(paymentsData || []).map(payment => ({
            ...payment,
            type: "payment"
          }))
        ];

        // Sort combined activity by date
        const sortedActivity = combinedActivity.sort((a, b) => {
          const dateA = a.type === "sale" ? new Date(a.salesdate).getTime() : new Date(a.paydate).getTime();
          const dateB = b.type === "sale" ? new Date(b.salesdate).getTime() : new Date(b.paydate).getTime();
          return dateB - dateA;
        }).slice(0, 10);

        setCustomerCount(customerCount || 0);
        setSalesData(salesData || []);
        setPaymentsData(paymentsData || []);
        setRecentActivity(sortedActivity);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for sales
  const salesChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [4500, 3500, 6000, 5000, 7500, 8000, 6500, 9000, 8500, 7000, 9500, 11000],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 2,
      },
    ],
  };

  // Chart data for payments
  const paymentsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Payments",
        data: [3800, 3200, 5500, 4800, 7200, 7500, 6200, 8500, 8000, 6800, 9200, 10500],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and activity.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerCount}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesData.length > 0 ? salesData.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0).toLocaleString() : "0"}</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${paymentsData.length > 0 ? paymentsData.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0).toLocaleString() : "0"}</div>
                <p className="text-xs text-muted-foreground">
                  +5.7% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentActivity.length}</div>
                <p className="text-xs text-muted-foreground">
                  +19.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Sales transactions in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart 
                  data={salesChartData}
                  height={350}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest transactions and customer interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">Loading activity...</div>
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${activity.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {activity.type === 'payment' ? (
                            <CreditCard className={`h-4 w-4 text-green-600`} />
                          ) : (
                            <DollarSign className={`h-4 w-4 text-blue-600`} />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.type === 'payment' ? `Payment #${activity.orno}` : `Sale #${activity.transno}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.type === 'payment' 
                              ? `Payment received on ${format(new Date(activity.paydate), 'MMM d, yyyy')}`
                              : `Sale made on ${format(new Date(activity.salesdate), 'MMM d, yyyy')}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={activity.type === 'payment' ? 'outline' : 'default'}>
                            {activity.type === 'payment' ? 'Payment' : 'Sale'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">No recent activity found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
                <CardDescription>
                  Comparison of sales over the past 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart 
                  data={salesChartData}
                  height={350}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>
                  Payment patterns over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={paymentsChartData}
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
