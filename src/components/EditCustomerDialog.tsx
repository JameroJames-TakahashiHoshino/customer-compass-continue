
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CustomerType {
  custno: string;
  custname: string | null;
  address: string | null;
  payterm: string | null;
}

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerNo: string;
  onUpdated: () => void;
}

const EditCustomerDialog = ({ open, onOpenChange, customerNo, onUpdated }: EditCustomerDialogProps) => {
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    custname: "",
    address: "",
    payterm: ""
  });

  useEffect(() => {
    if (open && customerNo) {
      fetchCustomerData();
    }
  }, [open, customerNo]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .eq('custno', customerNo)
        .single();
      
      if (error) throw error;
      
      setCustomer(data);
      setFormData({
        custname: data.custname || "",
        address: data.address || "",
        payterm: data.payterm || ""
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch customer data");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('customer')
        .update({
          custname: formData.custname || null,
          address: formData.address || null,
          payterm: formData.payterm || null
        })
        .eq('custno', customerNo);
      
      if (error) throw error;
      
      toast.success("Customer updated successfully");
      onUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Ensure we properly clean up when dialog is closed
      if (!newOpen) {
        setTimeout(() => onOpenChange(false), 0);
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>
                Make changes to the customer details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custno" className="text-right">
                  Customer No
                </Label>
                <Input
                  id="custno"
                  value={customerNo}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custname" className="text-right">
                  Name
                </Label>
                <Input
                  id="custname"
                  name="custname"
                  value={formData.custname}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payterm" className="text-right">
                  Payment Terms
                </Label>
                <Input
                  id="payterm"
                  name="payterm"
                  value={formData.payterm}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
