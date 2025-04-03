
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomerCard, { CustomerType } from "@/components/CustomerCard";
import { Plus, Search } from "lucide-react";

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
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    phone: "(555) 234-5678",
    status: "active",
    lastContact: "2023-10-12",
    company: "Wilson Consulting"
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "(555) 876-5432",
    status: "inactive",
    lastContact: "2023-09-20"
  }
];

const Customers = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      navigate("/");
    } else {
      // Load customers (in a real app, this would be an API call)
      setCustomers(mockCustomers);
    }
  }, [navigate]);

  useEffect(() => {
    // Filter customers based on search term and status filter
    let filtered = [...mockCustomers];
    
    if (searchTerm) {
      filtered = filtered.filter(
        customer => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    setCustomers(filtered);
  }, [searchTerm, statusFilter]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button asChild>
          <Link to="/customers/new">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Link>
        </Button>
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
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.length > 0 ? (
          customers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        ) : (
          <div className="col-span-full flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No customers found</p>
            {searchTerm || statusFilter !== "all" ? (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
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
    </div>
  );
};

export default Customers;
