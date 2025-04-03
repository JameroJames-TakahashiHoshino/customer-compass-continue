
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CustomerType } from "@/components/CustomerCard";
import { InteractionType } from "@/components/InteractionItem";
import InteractionItem from "@/components/InteractionItem";
import { format } from "date-fns";
import { ArrowLeft, Building, Calendar, Mail, MapPin, Phone, Plus } from "lucide-react";

// Mock customer data
const mockCustomers: CustomerType[] = [
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
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "(555) 789-0123",
    status: "pending",
    lastContact: "2023-10-05",
    company: "Marketing Pros"
  }
];

// Mock interactions
const mockInteractions: Record<number, InteractionType[]> = {
  1: [
    {
      id: 1,
      type: "call",
      title: "Sales Call",
      description: "Discussed new product offerings and pricing options. John showed interest in our premium plan.",
      date: "2023-10-15T14:30:00",
      user: {
        name: "Demo User"
      }
    },
    {
      id: 2,
      type: "email",
      title: "Follow-up Email",
      description: "Sent detailed information about the products discussed on the call along with pricing documents.",
      date: "2023-10-16T09:15:00",
      user: {
        name: "Demo User"
      }
    },
    {
      id: 3,
      type: "meeting",
      title: "Product Demo",
      description: "Scheduled a virtual product demonstration with the client's team for next week.",
      date: "2023-10-12T11:00:00",
      user: {
        name: "Demo User"
      }
    }
  ],
  2: [
    {
      id: 1,
      type: "meeting",
      title: "Initial Consultation",
      description: "Met with Sarah to discuss her company's design requirements for the new website.",
      date: "2023-10-10T10:00:00",
      user: {
        name: "Demo User"
      }
    }
  ],
  3: [
    {
      id: 1,
      type: "note",
      title: "Inactive Status Note",
      description: "Michael hasn't responded to our last 3 attempts to contact him. Marking as inactive for now.",
      date: "2023-09-28T16:45:00",
      user: {
        name: "Demo User"
      }
    }
  ],
  4: [
    {
      id: 1,
      type: "email",
      title: "Welcome Email",
      description: "Sent a welcome email with our onboarding materials and next steps.",
      date: "2023-10-05T14:00:00",
      user: {
        name: "Demo User"
      }
    }
  ]
};

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
};

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [interactions, setInteractions] = useState<InteractionType[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      navigate("/");
    } else if (id) {
      // Find customer by ID
      const customerId = parseInt(id);
      const foundCustomer = mockCustomers.find(c => c.id === customerId);
      
      if (foundCustomer) {
        setCustomer(foundCustomer);
        // Load customer interactions
        setInteractions(mockInteractions[customerId] || []);
      } else {
        // Customer not found, redirect to customer list
        navigate("/customers");
      }
    }
  }, [id, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (!isAuthenticated || !customer) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> 
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Customer information and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-3 border-b pb-5">
              <Avatar className="h-20 w-20">
                <AvatarImage src={customer.imageUrl} alt={customer.name} />
                <AvatarFallback className="text-2xl">{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-semibold">{customer.name}</h3>
                {customer.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
                <Badge className={statusColors[customer.status]}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4 pt-5">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
              {customer.company && (
                <div className="flex items-start space-x-3">
                  <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Last Contact</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(customer.lastContact), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    123 Example St<br />
                    Suite 500<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col space-y-2">
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call Customer
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Interactions, Notes, etc. */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="interactions">
            <TabsList className="w-full">
              <TabsTrigger value="interactions" className="flex-1">Interactions</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interactions" className="space-y-4 pt-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Customer Interactions</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Interaction
                </Button>
              </div>
              
              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map(interaction => (
                    <InteractionItem key={interaction.id} interaction={interaction} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-2 text-center text-muted-foreground">No interactions recorded yet</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Interaction
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Customer's order history</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">No orders found for this customer</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Customer notes and reminders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">No notes added yet</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>Documents and files related to this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">No files uploaded</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
