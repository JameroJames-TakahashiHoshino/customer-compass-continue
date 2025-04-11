
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationContext";

interface CustomerFormProps {
  defaultValues?: {
    custno?: string;
    custname?: string;
    address?: string;
    payterm?: string;
  };
  isEditing?: boolean;
  onSuccess?: () => void;
}

const CustomerForm = ({ defaultValues, isEditing = false, onSuccess }: CustomerFormProps) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    custno: defaultValues?.custno || "",
    custname: defaultValues?.custname || "",
    address: defaultValues?.address || "",
    payterm: defaultValues?.payterm || ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('customer')
          .update({
            custname: formData.custname,
            address: formData.address,
            payterm: formData.payterm
          })
          .eq('custno', formData.custno);
          
        if (error) throw error;
        
        toast.success("Customer updated successfully");
        if (onSuccess) onSuccess();
      } else {
        // Check if customer number already exists
        const { data: existingCustomer } = await supabase
          .from('customer')
          .select('custno')
          .eq('custno', formData.custno)
          .single();
          
        if (existingCustomer) {
          toast.error("Customer number already exists");
          setLoading(false);
          return;
        }
        
        const { error } = await supabase
          .from('customer')
          .insert([formData]);
          
        if (error) throw error;
        
        toast.success("Customer added successfully");
        
        // Add notification
        addNotification(`New customer added: ${formData.custname || formData.custno}`);
        
        navigate("/customers");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custno">Customer Number</Label>
            <Input
              id="custno"
              name="custno"
              value={formData.custno}
              onChange={handleChange}
              required
              readOnly={isEditing}
              className={isEditing ? "bg-muted" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custname">Customer Name</Label>
            <Input
              id="custname"
              name="custname"
              value={formData.custname}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter customer address"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payterm">Payment Terms</Label>
            <Input
              id="payterm"
              name="payterm"
              value={formData.payterm}
              onChange={handleChange}
              placeholder="e.g., NET 30"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CustomerForm;
