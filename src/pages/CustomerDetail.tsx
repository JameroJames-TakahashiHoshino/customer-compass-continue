
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
import { InteractionType } from "@/components/InteractionItem";
import InteractionItem from "@/components/InteractionItem";
import { format } from "date-fns";
import { ArrowLeft, Building, Calendar, Mail, MapPin, Phone, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface CustomerType {
  custno: string;
  custname: string | null;
  address: string | null;
  payterm: string | null;
  status?: "active" | "inactive" | "pending";
  lastContact?: string;
  imageUrl?: string;
}

// Mock interactions
const mockInteractions: Record<string, InteractionType[]> = {
  "1": [
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
      type: "email",
      title: "Follow-up Email",
      description: "Sent detailed information about the products discussed on the call along with pricing documents.",
      date: "2023-10-16T09:15:00",
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
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [interactions, setInteractions] = useState<InteractionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/");
        return;
      }
      
      fetchCustomerDetails();
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
  }, [id, navigate]);

  const fetchCustomerDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .eq('custno', id)
        .single();

      if (error) {
        console.error('Error fetching customer:', error);
        navigate("/customers");
        return;
      }

      if (data) {
        const customerData: CustomerType = {
          ...data,
          status: "active",
          lastContact: new Date().toISOString().split('T')[0]
        };
        setCustomer(customerData);
        
        // For now, use mock interactions
        setInteractions(mockInteractions[id] || []);
      } else {
        navigate("/customers");
      }
    } catch (error) {
      console.error('Error:', error);
      navigate("/customers");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const status = customer.status || "active";

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
                <AvatarImage src={customer.imageUrl} alt={customer.custname || ""} />
                <AvatarFallback className="text-2xl">{getInitials(customer.custname || "")}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-semibold">{customer.custname || "Unnamed Customer"}</h3>
                <Badge className={statusColors[status]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4 pt-5">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Customer ID</p>
                  <p className="text-sm text-muted-foreground">{customer.custno}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Payment Terms</p>
                  <p className="text-sm text-muted-foreground">{customer.payterm || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.address || "No address provided"}
                  </p>
                </div>
              </div>
              {customer.lastContact && (
                <div className="flex items-start space-x-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Last Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(customer.lastContact), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
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
