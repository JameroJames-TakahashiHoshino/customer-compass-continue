
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InteractionType } from "@/components/InteractionItem";
import { ArrowRight, Plus, Users, BarChart3, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface CustomerType {
  custno: string;
  custname: string | null;
  address: string | null;
  payterm: string | null;
}

const mockRecentInteractions: InteractionType[] = [
  {
    id: 1,
    type: "call",
    title: "Sales Call",
    description: "Discussed new product offerings and pricing options.",
    date: "2023-10-15T14:30:00",
    user: {
      name: "Demo User"
    }
  },
  {
    id: 2,
    type: "meeting",
    title: "Project Kickoff",
    description: "Initial meeting to discuss project requirements and timeline.",
    date: "2023-10-12T10:00:00",
    user: {
      name: "Demo User"
    }
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentCustomers, setRecentCustomers] = useState<CustomerType[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/");
      } else {
        await fetchCustomers();
        await fetchCustomerCount();
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

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .limit(3)
        .order('custno', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }

      setRecentCustomers(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCustomerCount = async () => {
    try {
      const { count, error } = await supabase
        .from('customer')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error counting customers:', error);
        return;
      }

      setCustomerCount(count || 0);
    } catch (error) {
      console.error('Error:', error);
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
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground">Customers with activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRecentInteractions.length}</div>
            <p className="text-xs text-muted-foreground">In the last 7 days</p>
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
              Latest interactions with your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentInteractions.map(interaction => (
                <div key={interaction.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{interaction.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(interaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm">{interaction.description}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/activity">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
