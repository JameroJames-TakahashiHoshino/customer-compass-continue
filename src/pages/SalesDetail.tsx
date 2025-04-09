
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";

interface SalesDetailType {
  transno: string;
  salesdate: string | null;
  custno: string | null;
  customer?: {
    custname: string | null;
  };
}

interface SalesDetailItem {
  prodcode: string;
  quantity: number | null;
  product?: {
    description: string | null;
    unit: string | null;
  };
}

const SalesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saleData, setSaleData] = useState<SalesDetailType | null>(null);
  const [saleItems, setSaleItems] = useState<SalesDetailItem[]>([]);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setLoading(true);
      try {
        // Fetch the sale header information
        const { data: saleHeader, error: saleError } = await supabase
          .from('sales')
          .select(`
            *,
            customer:custno (custname)
          `)
          .eq('transno', id)
          .single();

        if (saleError) {
          console.error('Error fetching sale:', saleError);
          toast.error("Error fetching sale data");
          return;
        }

        setSaleData(saleHeader);

        // Fetch the sale detail items
        const { data: saleDetail, error: detailError } = await supabase
          .from('salesdetail')
          .select(`
            *,
            product:prodcode (description, unit)
          `)
          .eq('transno', id);

        if (detailError) {
          console.error('Error fetching sale details:', detailError);
          toast.error("Error fetching sale detail data");
          return;
        }

        setSaleItems(saleDetail);
      } catch (error) {
        console.error('Error:', error);
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!saleData) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => navigate('/sales')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sales
        </Button>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Sale not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate('/sales')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sales
      </Button>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sales Transaction: {saleData.transno}</CardTitle>
            <CardDescription>
              Sale Date: {formatDate(saleData.salesdate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-2">Customer Information</h3>
                <p className="text-muted-foreground">
                  Customer: {saleData.customer?.custname || saleData.custno || 'Not specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            {saleItems.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No items found for this transaction</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.prodcode}</TableCell>
                      <TableCell>{item.product?.description || '-'}</TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>{item.product?.unit || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="border-t p-6 flex justify-end">
            <Button onClick={() => window.print()} variant="outline" className="mr-2">Print</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SalesDetail;
