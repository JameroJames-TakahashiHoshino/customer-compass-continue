
import { toast } from "sonner";

export const notifyCustomerAdded = (customerData: { id: string; name?: string }) => {
  // Store notification data in localStorage so it persists across navigations
  localStorage.setItem('customerAdded', JSON.stringify(customerData));
  
  // Dispatch a storage event so other tabs can pick it up
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'customerAdded',
    newValue: JSON.stringify(customerData)
  }));

  // Also show toast immediately in current tab
  toast(
    "Customer Added",
    { 
      description: `${customerData.name || 'New customer'} has been added successfully!`
    }
  );
};
