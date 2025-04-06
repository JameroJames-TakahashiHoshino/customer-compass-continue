
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// Fix the import to use the correct components from chart.tsx
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch total customers
        const { data: customers, error: customersError } = await supabase
          .from('customer')
          .select('*', { count: 'exact' });

        if (customersError) {
          console.error("Error fetching customers:", customersError);
        } else {
          setTotalCustomers(customers ? customers.length : 0);
        }

        // Fetch total sales
        const { data: sales, error: salesError } = await supabase
          .from('sales')
          .select('*');

        if (salesError) {
          console.error("Error fetching sales:", salesError);
        } else {
          // Since amount isn't directly on sales table, we'll use a placeholder or count
          const totalSalesCount = sales?.length || 0;
          setTotalSales(totalSalesCount);
          setSalesData(sales || []);
        }

        // Fetch total payments
        const { data: payments, error: paymentsError } = await supabase
          .from('payment')
          .select('*');

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
        } else {
          const totalPaymentsAmount = payments?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
          setTotalPayments(totalPaymentsAmount);
          setPaymentData(payments || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine sales and payment data for activity feed
  const activityData: ActivityItem[] = [
    ...salesData.map(sale => ({ ...sale, type: 'sale' as const })), 
    ...paymentData.map(payment => ({ ...payment, type: 'payment' as const }))
  ];

  // Sort activity data by date
  const sortedActivityData = activityData.sort((a, b) => {
    const dateA = a.type === 'sale' && a.salesdate ? new Date(a.salesdate) : 
                 a.type === 'payment' && a.paydate ? new Date(a.paydate) : new Date();
    const dateB = b.type === 'sale' && b.salesdate ? new Date(b.salesdate) : 
                 b.type === 'payment' && b.paydate ? new Date(b.paydate) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  // Format the activity date based on the item type
  const formatActivityDate = (item: ActivityItem): string => {
    if (item.type === 'sale' && item.salesdate) {
      return item.salesdate;
    } else if (item.type === 'payment' && item.paydate) {
      return item.paydate;
    }
    return '';
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
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

        <Card>
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

        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A summary of sales over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales and payments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-auto">
            {loading ? (
              <div>Loading activity...</div>
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
};

export default Dashboard;
