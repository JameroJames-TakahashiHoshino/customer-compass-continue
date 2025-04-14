
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Customer {
  custno: string;
  custname?: string;
  address?: string;
  payterm?: string;
}

interface Sale {
  transno: string;
  salesdate?: string;
  custno?: string;
  empno?: string;
  amount?: number;
}

interface Payment {
  orno: string;
  paydate?: string;
  amount?: number;
  transno?: string;
}

type ActivityItem = (Sale & { type: 'sale' }) | (Payment & { type: 'payment' });

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [totalPayments, setTotalPayments] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDataFetchError(null);
      
      try {
        console.log("Fetching dashboard data from Supabase...");
        
        // Fetch customers data
        const { data: customers, error: customersError } = await supabase
          .from('customer')
          .select('*')
          .limit(100);

        if (customersError) {
          console.error("Error fetching customers:", customersError);
          throw new Error(`Customer fetch failed: ${customersError.message}`);
        } else {
          console.log(`Fetched ${customers?.length} customers`);
          setTotalCustomers(customers?.length || 0);
        }

        // Fetch sales data
        const { data: sales, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .limit(100);

        if (salesError) {
          console.error("Error fetching sales:", salesError);
          throw new Error(`Sales fetch failed: ${salesError.message}`);
        } else {
          console.log(`Fetched ${sales?.length} sales`);
          setTotalSales(sales?.length || 0);
          setSalesData(sales || []);
        }

        // Fetch payment data
        const { data: payments, error: paymentsError } = await supabase
          .from('payment')
          .select('*')
          .limit(100);

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
          throw new Error(`Payments fetch failed: ${paymentsError.message}`);
        } else {
          console.log(`Fetched ${payments?.length} payments`);
          const totalPaymentsAmount = payments?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
          setTotalPayments(totalPaymentsAmount);
          setPaymentData(payments || []);
        }
      } catch (error: any) {
        console.error("Dashboard data fetch error:", error);
        setDataFetchError(error.message);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activityData: ActivityItem[] = [
    ...salesData.map(sale => ({ ...sale, type: 'sale' as const })), 
    ...paymentData.map(payment => ({ ...payment, type: 'payment' as const }))
  ];

  const sortedActivityData = activityData.sort((a, b) => {
    const dateA = a.type === 'sale' && a.salesdate ? new Date(a.salesdate) : 
                 a.type === 'payment' && a.paydate ? new Date(a.paydate) : new Date();
    const dateB = b.type === 'sale' && b.salesdate ? new Date(b.salesdate) : 
                 b.type === 'payment' && b.paydate ? new Date(b.paydate) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  const formatActivityDate = (item: ActivityItem): string => {
    if (item.type === 'sale' && item.salesdate) {
      return new Date(item.salesdate).toLocaleDateString();
    } else if (item.type === 'payment' && item.paydate) {
      return new Date(item.paydate).toLocaleDateString();
    }
    return '';
  };

  return (
    <div className="w-full max-w-full py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {dataFetchError && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          <p className="font-semibold">Error loading data:</p>
          <p>{dataFetchError}</p>
          <p className="mt-2 text-sm">Check your Supabase connection and database tables</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Customers
            </CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <div className="text-2xl font-bold">{totalCustomers !== null ? totalCustomers : 'N/A'}</div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Sales
            </CardTitle>
            <CardDescription>Number of transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <div className="text-2xl font-bold">{totalSales !== null ? totalSales : 'N/A'}</div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Total Payments
            </CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <div className="text-2xl font-bold">${totalPayments !== null ? totalPayments.toFixed(2) : 'N/A'}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A summary of sales over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : salesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            ) : (
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="salesdate" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="transno" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales and payments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-auto">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : sortedActivityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No recent activity found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedActivityData.map((item, index) => (
                  <div key={index} className="py-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">
                        {item.type === 'sale' ? 'Sale' : 'Payment'} - {item.type === 'sale' ? item.transno : item.orno}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatActivityDate(item)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
