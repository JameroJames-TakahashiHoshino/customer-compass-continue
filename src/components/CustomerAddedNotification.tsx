
import { useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export const useCustomerAddedNotification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for customer added events through local storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customerAdded' && e.newValue) {
        try {
          const customerData = JSON.parse(e.newValue);
          toast(
            "Customer Added",
            { 
              description: `${customerData.name || 'New customer'} has been added successfully!`,
              action: {
                label: "View",
                onClick: () => navigate(`/customers/${customerData.id}`),
              },
            }
          );
        } catch (error) {
          console.error('Error parsing customer data', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check if there's a pending notification
    const pendingNotification = localStorage.getItem('customerAdded');
    if (pendingNotification) {
      try {
        const customerData = JSON.parse(pendingNotification);
        toast(
          "Customer Added",
          { 
            description: `${customerData.name || 'New customer'} has been added successfully!`,
            action: {
              label: "View",
              onClick: () => navigate(`/customers/${customerData.id}`),
            },
          }
        );
        // Remove the notification once shown
        localStorage.removeItem('customerAdded');
      } catch (error) {
        console.error('Error parsing customer data', error);
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return null;
};

// Component to be used in App.tsx or a layout component
export const CustomerAddedNotification = () => {
  useCustomerAddedNotification();
  return null;
};
