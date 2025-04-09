
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    custno: "",
    custname: "",
    address: "",
    payterm: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
      const { data: existingCustomer, error: checkError } = await supabase
        .from('customer')
        .select('custno')
        .eq('custno', formData.custno)
        .maybeSingle();

      if (checkError) throw checkError;

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
      console.error("Error adding customer:", error);
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
                placeholder="Unique customer identifier"
                required
                className="dark:text-foreground dark:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custname">Customer Name</Label>
              <Input
                id="custname"
                value={formData.custname}
                onChange={handleChange}
                placeholder="Customer name"
                required
                className="dark:text-foreground dark:bg-background"
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
                className="dark:text-foreground dark:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payterm">Payment Terms</Label>
              <Input
                id="payterm"
                value={formData.payterm}
                onChange={handleChange}
                placeholder="Payment terms"
                className="dark:text-foreground dark:bg-background"
              />
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
            <Button type="submit" disabled={loading}>
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
