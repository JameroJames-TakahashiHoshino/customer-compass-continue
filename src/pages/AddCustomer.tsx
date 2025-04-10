
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(true);
  const [formData, setFormData] = useState({
    custno: "",
    custname: "",
    address: "",
    payterm: ""
  });

  // Fetch the latest customer ID and generate a new one on component mount
  useEffect(() => {
    generateNextCustomerId();
  }, []);

  const generateNextCustomerId = async () => {
    setGeneratingId(true);
    try {
      // Fetch the latest customer with the highest ID
      const { data, error } = await supabase
        .from('customer')
        .select('custno')
        .like('custno', 'C%')
        .order('custno', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextId = "C0001"; // Default starting ID

      if (data && data.length > 0) {
        const lastId = data[0].custno;
        // Extract the numeric part and increment it
        const numericPart = parseInt(lastId.substring(1), 10);
        const nextNumeric = numericPart + 1;
        nextId = `C${nextNumeric.toString().padStart(4, '0')}`;
      }

      setFormData(prev => ({ ...prev, custno: nextId }));
    } catch (error) {
      console.error("Error generating customer ID:", error);
      toast.error("Failed to generate customer ID");
    } finally {
      setGeneratingId(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, payterm: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.custno || !formData.custname) {
      toast.error("Customer ID and Name are required");
      return;
    }

    setLoading(true);
    try {
      // Check if customer ID already exists
      const { data: existingCustomer } = await supabase
        .from('customer')
        .select('custno')
        .eq('custno', formData.custno)
        .single();

      if (existingCustomer) {
        toast.error("A customer with this ID already exists");
        setLoading(false);
        return;
      }

      // Insert new customer
      const { error } = await supabase
        .from('customer')
        .insert(formData);

      if (error) throw error;

      toast.success("Customer added successfully");
      navigate('/customers');
    } catch (error: any) {
      toast.error(error.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Customer</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custno">Customer ID</Label>
              <Input
                id="custno"
                value={formData.custno}
                onChange={handleChange}
                placeholder="Generating ID..."
                disabled={generatingId}
                readOnly
                className="bg-muted"
              />
              {generatingId && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Generating ID...
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custname">Customer Name</Label>
              <Input
                id="custname"
                value={formData.custname}
                onChange={handleChange}
                placeholder="Customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Customer address"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payterm">Payment Terms</Label>
              <Select
                value={formData.payterm}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="payterm" className="w-full">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                  <SelectItem value="30D">30 Days (30D)</SelectItem>
                  <SelectItem value="45D">45 Days (45D)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate('/customers')}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || generatingId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Customer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddCustomer;
