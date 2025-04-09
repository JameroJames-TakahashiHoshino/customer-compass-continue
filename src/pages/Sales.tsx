
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface SalesType {
  transno: string;
  salesdate: string | null;
  custno: string | null;
  empno: string | null;
  customer?: {
    custname: string | null;
  };
  employee?: {
    firstname: string | null;
    lastname: string | null;
  };
}

const Sales = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<SalesType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate("/");
        return;
      }
      
      fetchSales();
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
  }, [navigate, currentPage]);

  // Effect to handle search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search term changes
    fetchSales();
  }, [debouncedSearchTerm]);

  const fetchSales = async () => {
    setLoading(true);
    setNoResults(false);
    try {
      // Calculate pagination range
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('sales')
        .select(`
          *,
          customer:custno (custname),
          employee:empno (firstname, lastname)
        `, { count: 'exact' });

      // Apply search filter if searchTerm exists
      if (debouncedSearchTerm.trim()) {
        query = query
          .or(`transno.ilike.%${debouncedSearchTerm.trim()}%,custno.ilike.%${debouncedSearchTerm.trim()}%,empno.ilike.%${debouncedSearchTerm.trim()}%`);
      }

      // Get paginated results
      const { data, count, error } = await query
        .range(from, to)
        .order('transno', { ascending: true });

      if (error) {
        console.error('Error fetching sales:', error);
        toast.error("Error fetching sales data");
        return;
      }

      setSales(data as SalesType[]);
      
      // Set no results flag
      if (data && data.length === 0 && debouncedSearchTerm.trim()) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewSale = (transno: string) => {
    toast.info(`Viewing sale ${transno}`);
    // For now we just show a toast since the detail page doesn't exist yet
    // navigate(`/sales/${transno}`);
  };

  if (loading && !sales.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getCustomerName = (sale: SalesType) => {
    if (sale.customer && sale.customer.custname) {
      return sale.customer.custname;
    }
    return sale.custno || "-";
  };

  const getEmployeeName = (sale: SalesType) => {
    if (sale.employee && (sale.employee.firstname || sale.employee.lastname)) {
      return `${sale.employee.firstname || ""} ${sale.employee.lastname || ""}`.trim();
    }
    return sale.empno || "-";
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sales Records</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              type="search"
              placeholder="Search sales transactions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading && sales.length > 0 ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {noResults
                      ? `No results found for "${debouncedSearchTerm}"`
                      : sales.length === 0
                        ? "No sales found"
                        : `Showing ${sales.length} of ${totalPages * itemsPerPage} sales records`}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {noResults 
                            ? `No results found for "${debouncedSearchTerm}"`
                            : "No sales records available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.map((sale) => (
                        <TableRow key={sale.transno}>
                          <TableCell className="font-medium">{sale.transno}</TableCell>
                          <TableCell>{formatDate(sale.salesdate)}</TableCell>
                          <TableCell>
                            {sale.custno ? (
                              <Link 
                                to={`/customers/${sale.custno}`} 
                                className="text-primary hover:underline"
                              >
                                {getCustomerName(sale)}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{getEmployeeName(sale)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewSale(sale.transno)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
