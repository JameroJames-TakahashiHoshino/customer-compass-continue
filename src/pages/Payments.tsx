
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
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PaymentType {
  orno: string;
  paydate: string | null;
  amount: number | null;
  transno: string | null;
}

const Payments = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      
      fetchPayments();
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

  const fetchPayments = async () => {
    setLoading(true);
    setNoResults(false);
    try {
      // Calculate pagination range
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('payment')
        .select('*', { count: 'exact' });

      // Apply search filter if searchTerm exists
      if (searchTerm.trim()) {
        query = query
          .or(`orno.ilike.%${searchTerm.trim()}%,transno.ilike.%${searchTerm.trim()}%`);
      }

      // Get paginated results
      const { data, count, error } = await query
        .range(from, to)
        .order('orno', { ascending: true });

      if (error) {
        console.error('Error fetching payments:', error);
        toast.error("Error fetching payment data");
        return;
      }

      setPayments(data as PaymentType[]);
      
      // Set no results flag
      if (data && data.length === 0 && searchTerm.trim()) {
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
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setCurrentPage(1); // Reset to first page when searching
    fetchPayments();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      // Clear search and reset results if search box is cleared
      setSearchTerm('');
      setCurrentPage(1);
      fetchPayments();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && !payments.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payment Records</CardTitle>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              type="search"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
            <Button type="submit" disabled={searching}>
              {searching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading && payments.length > 0 ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {noResults
                      ? `No results found for "${searchTerm}"`
                      : payments.length === 0
                        ? "No payments found"
                        : `Showing ${payments.length} of ${totalPages * itemsPerPage} payments`}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OR Number</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {noResults 
                            ? `No results found for "${searchTerm}"`
                            : "No payment records available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => (
                        <TableRow key={payment.orno}>
                          <TableCell className="font-medium">{payment.orno}</TableCell>
                          <TableCell>{payment.transno || "-"}</TableCell>
                          <TableCell>{formatDate(payment.paydate)}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
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

export default Payments;
