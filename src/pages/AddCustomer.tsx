
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "@/components/CustomerForm";
import { toast } from "sonner";

const AddCustomer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = (customerNo?: string) => {
    setIsSubmitting(false);
    toast.success(`Customer ${customerNo || ''} added successfully`);
    if (customerNo) {
      navigate(`/customers/${customerNo}`);
    } else {
      navigate('/customers');
    }
  };

  const handleError = (error: any) => {
    setIsSubmitting(false);
    toast.error("Failed to add customer: " + (error.message || "Unknown error"));
  };

  return (
    <div className="w-full py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
      <CustomerForm 
        onSubmitting={() => setIsSubmitting(true)} 
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default AddCustomer;
