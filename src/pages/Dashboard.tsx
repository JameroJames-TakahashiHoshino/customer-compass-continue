import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// Fix the incorrect import
import { Chart } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [totalPayments, setTotalPayments] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch total customers
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*', { count: 'exact' });

        if (customersError) {
          console.error("Error fetching customers:", customersError);
        } else {
          setTotalCustomers(customers ? customers.length : 0);
        }

        // Fetch total sales
        const { data: sales, error: salesError } = await supabase
          .from('sales')
          .select('amount');

        if (salesError) {
          console.error("Error fetching sales:", salesError);
        } else {
          const totalSalesAmount = sales?.reduce((acc, sale) => acc + sale.amount, 0) || 0;
          setTotalSales(totalSalesAmount);
          setSalesData(sales || []);
        }

        // Fetch total payments
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount');

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
        } else {
          const totalPaymentsAmount = payments?.reduce((acc, payment) => acc + payment.amount, 0) || 0;
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
  const activityData = [...salesData.map(sale => ({ ...sale, type: 'sale' })), ...paymentData.map(payment => ({ ...payment, type: 'payment' }))];

  // Sort activity data by date
  const sortedActivityData = activityData.sort((a, b) => {
    const dateA = a.salesdate ? new Date(a.salesdate) : new Date(a.paydate);
    const dateB = b.salesdate ? new Date(b.salesdate) : new Date(b.paydate);
    return dateB.getTime() - dateA.getTime();
  });

  // Format the activity date based on the item type
  // Fix the type checking for activity items
  const formatActivityDate = (item: any) => {
    // Check which type of item we're dealing with
    if ('salesdate' in item) {
      return item.salesdate; // Sales item
    } else if ('paydate' in item) {
      return item.paydate; // Payment item
    }
    return ''; // Fallback
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
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <div className="text-2xl font-bold">${totalSales !== null ? totalSales.toFixed(2) : 'N/A'}</div>
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
          <CardContent>
            <Chart data={salesData} dataKey="amount" nameKey="salesdate" type="area" color="#82ca9d" />
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
                        {item.type === 'sale' ? 'Sale' : 'Payment'} - ${item.amount}
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
