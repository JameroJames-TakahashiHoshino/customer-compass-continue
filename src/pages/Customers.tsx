
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import CustomerActions from "@/components/CustomerActions";
import EditCustomerDialog from "@/components/EditCustomerDialog";
import CustomerViewToggle from "@/components/CustomerViewToggle";

interface CustomerType {
  custno: string;
  custname: string | null;
  address: string | null;
  payterm: string | null;
}

const Customers = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCustomerNo, setEditingCustomerNo] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/");
        return;
      }
      
      fetchCustomers();
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
    setLoading(true);
    try {
      let query = supabase
        .from('customer')
        .select('*');

      if (searchTerm) {
        query = query
          .or(`custname.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,custno.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }

      setCustomers(data as CustomerType[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCustomers();
    }
  }, [searchTerm]);

  const handleEditCustomer = (customerNo: string) => {
    setEditingCustomerNo(customerNo);
    setIsEditDialogOpen(true);
  };

  const handleCustomerUpdated = () => {
    fetchCustomers();
  };

  const handleViewChange = (view: "grid" | "table") => {
    setViewMode(view);
  };

  if (loading && !customers.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center gap-4">
          <CustomerViewToggle currentView={viewMode} onViewChange={handleViewChange} />
          <Button asChild>
            <Link to="/customers/new">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {customers.length > 0 ? (
            customers.map(customer => (
              <Card key={customer.custno} className="h-full flex flex-col">
                <CardHeader className="flex-none pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{customer.custname || "Unnamed Customer"}</CardTitle>
                      <CardDescription>Customer #{customer.custno}</CardDescription>
                    </div>
                    <CustomerActions 
                      customerNo={customer.custno} 
                      onEdit={() => handleEditCustomer(customer.custno)}
                      onDeleted={fetchCustomers}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Address: </span>
                      <span className="line-clamp-2">{customer.address || "No address provided"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Payment Terms: </span>
                      <span className="line-clamp-1">{customer.payterm || "Not specified"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-none mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/customers/${customer.custno}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No customers found</p>
              {searchTerm ? (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button className="mt-2" asChild>
                  <Link to="/customers/new">
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  {customers.length === 0
                    ? "No customers found"
                    : `List of customers: ${customers.length} total`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer No</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Payment Term</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.custno}>
                      <TableCell className="font-medium">{customer.custno}</TableCell>
                      <TableCell>{customer.custname || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{customer.address || "-"}</TableCell>
                      <TableCell>{customer.payterm || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/customers/${customer.custno}`)}
                          >
                            View
                          </Button>
                          <CustomerActions 
                            customerNo={customer.custno} 
                            onEdit={() => handleEditCustomer(customer.custno)}
                            onDeleted={fetchCustomers}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {editingCustomerNo && (
        <EditCustomerDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          customerNo={editingCustomerNo}
          onUpdated={handleCustomerUpdated}
        />
      )}
    </div>
  );
};

export default Customers;
