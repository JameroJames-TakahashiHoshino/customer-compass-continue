
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Users, BarChart3, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface CustomerType {
  custno: string;
  custname: string | null;
  address: string | null;
  payterm: string | null;
}

interface SalesType {
  transno: string;
  salesdate: string | null;
  custno: string | null;
  empno: string | null;
}

interface PaymentType {
  orno: string;
  paydate: string | null;
  amount: number | null;
  transno: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentCustomers, setRecentCustomers] = useState<CustomerType[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<(SalesType | PaymentType)[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/");
      } else {
        await fetchData();
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch recent customers
      const { data: customersData, error: customersError } = await supabase
        .from('customer')
        .select('*')
        .limit(3)
        .order('custno', { ascending: false });

      if (customersError) {
        console.error('Error fetching customers:', customersError);
      } else {
        setRecentCustomers(customersData || []);
      }

      // Count customers
      const { count: customerCount, error: countError } = await supabase
        .from('customer')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error counting customers:', countError);
      } else {
        setCustomerCount(customerCount || 0);
      }

      // Count sales
      const { count: salesCount, error: salesCountError } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true });

      if (salesCountError) {
        console.error('Error counting sales:', salesCountError);
      } else {
        setSalesCount(salesCount || 0);
      }

      // Count payments
      const { count: paymentCount, error: paymentCountError } = await supabase
        .from('payment')
        .select('*', { count: 'exact', head: true });

      if (paymentCountError) {
        console.error('Error counting payments:', paymentCountError);
      } else {
        setPaymentCount(paymentCount || 0);
      }

      // Fetch recent activity (sales and payments combined)
      const { data: recentSales, error: recentSalesError } = await supabase
        .from('sales')
        .select('*')
        .limit(3)
        .order('transno', { ascending: false });

      const { data: recentPayments, error: recentPaymentsError } = await supabase
        .from('payment')
        .select('*')
        .limit(3)
        .order('orno', { ascending: false });

      if (recentSalesError) {
        console.error('Error fetching recent sales:', recentSalesError);
      }
      
      if (recentPaymentsError) {
        console.error('Error fetching recent payments:', recentPaymentsError);
      }

      // Combine and sort recent activity
      const combinedActivity = [
        ...(recentSales || []).map(sale => ({ ...sale, type: 'sale' })),
        ...(recentPayments || []).map(payment => ({ ...payment, type: 'payment' }))
      ];
      
      // Sort by date (most recent first)
      const sortedActivity = combinedActivity.sort((a, b) => {
        const dateA = a.type === 'sale' ? a.salesdate : a.paydate;
        const dateB = b.type === 'sale' ? b.salesdate : b.paydate;
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }).slice(0, 5);
      
      setRecentActivity(sortedActivity);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link to="/customers/new">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground">From Supabase database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesCount}</div>
            <p className="text-xs text-muted-foreground">Total sales records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentCount}</div>
            <p className="text-xs text-muted-foreground">Total payment records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">In the last period</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Your most recently added customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.length > 0 ? (
                recentCustomers.map(customer => (
                  <div key={customer.custno} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{customer.custname || "Unnamed Customer"}</div>
                      <div className="text-sm text-muted-foreground">#{customer.custno}</div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/customers/${customer.custno}`}>
                        View <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">No customers found</div>
              )}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/customers">View All Customers</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  if ('salesdate' in activity) {
                    // This is a sale
                    return (
                      <div key={`sale-${activity.transno}`} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Sale #{activity.transno}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.salesdate ? new Date(activity.salesdate).toLocaleDateString() : 'No date'}
                          </div>
                        </div>
                        <div className="text-sm">Customer: {activity.custno || 'Unknown'}</div>
                      </div>
                    );
                  } else {
                    // This is a payment
                    return (
                      <div key={`payment-${activity.orno}`} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Payment #{activity.orno}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.paydate ? new Date(activity.paydate).toLocaleDateString() : 'No date'}
                          </div>
                        </div>
                        <div className="text-sm">
                          Amount: {activity.amount ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(activity.amount) : 'Unknown'}
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-center text-muted-foreground py-4">No recent activity</div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/sales">View All Sales</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/payments">View All Payments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
