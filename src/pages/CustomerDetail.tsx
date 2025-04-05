
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
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  const [customerSales, setCustomerSales] = useState<SalesType[]>([]);
  const [customerPayments, setCustomerPayments] = useState<PaymentType[]>([]);
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
      
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customer')
        .select('*')
        .eq('custno', id)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        navigate("/customers");
        return;
      }

      if (customerData) {
        const enrichedCustomer: CustomerType = {
          ...customerData,
          status: "active",
          lastContact: new Date().toISOString().split('T')[0]
        };
        setCustomer(enrichedCustomer);
        
        // Fetch sales for this customer
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .eq('custno', id);
          
        if (salesError) {
          console.error('Error fetching sales:', salesError);
        } else {
          setCustomerSales(salesData || []);
          
          // Fetch payments for the sales of this customer
          if (salesData && salesData.length > 0) {
            const transNumbers = salesData.map(sale => sale.transno);
            
            const { data: paymentsData, error: paymentsError } = await supabase
              .from('payment')
              .select('*')
              .in('transno', transNumbers);
              
            if (paymentsError) {
              console.error('Error fetching payments:', paymentsError);
            } else {
              setCustomerPayments(paymentsData || []);
            }
          }
        }
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
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
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
        
        {/* Tabs for Orders, Payments, etc. */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList className="w-full">
              <TabsTrigger value="orders" className="flex-1">Sales</TabsTrigger>
              <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Sales Records</h3>
              
              {customerSales.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of sales transactions for this customer</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Employee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerSales.map((sale) => (
                        <TableRow key={sale.transno}>
                          <TableCell className="font-medium">{sale.transno}</TableCell>
                          <TableCell>{formatDate(sale.salesdate)}</TableCell>
                          <TableCell>{sale.empno || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-2 text-center text-muted-foreground">No sales records found for this customer</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Payment History</h3>
              
              {customerPayments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of payments made by this customer</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>OR Number</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerPayments.map((payment) => (
                        <TableRow key={payment.orno}>
                          <TableCell className="font-medium">{payment.orno}</TableCell>
                          <TableCell>{formatDate(payment.paydate)}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.transno || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-2 text-center text-muted-foreground">No payment records found for this customer</p>
                  </CardContent>
                </Card>
              )}
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
