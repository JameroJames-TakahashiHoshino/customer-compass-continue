
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomerType } from "@/components/CustomerCard";
import { InteractionType } from "@/components/InteractionItem";
import { ArrowRight, Plus, Users, BarChart3, Calendar, Clock } from "lucide-react";

// Mock data - in a real app this would come from an API
const mockRecentCustomers: CustomerType[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    status: "active",
    lastContact: "2023-10-15",
    company: "Tech Solutions Inc"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 987-6543",
    status: "active",
    lastContact: "2023-10-10",
    company: "Design Masters"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "(555) 456-7890",
    status: "inactive",
    lastContact: "2023-09-28"
  }
];

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      navigate("/");
    }
  }, [navigate]);

  if (!isAuthenticated) {
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
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+6 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
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
              {mockRecentCustomers.map(customer => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.company}</div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/customers/${customer.id}`}>
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
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
