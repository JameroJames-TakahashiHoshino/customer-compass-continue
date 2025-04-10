
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomerActionsProps {
  customerNo: string;
  onEdit: () => void;
  onDeleted: () => void;
}

const CustomerActions = ({ customerNo, onEdit, onDeleted }: CustomerActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async () => {
    if (!customerNo) return;
    
    setIsDeleting(true);
    try {
      // Check if customer has any related sales records
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('transno')
        .eq('custno', customerNo)
        .limit(1);
      
      if (salesError) throw salesError;
      
      if (salesData && salesData.length > 0) {
        toast.error("Cannot delete customer with existing sales records");
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      const { error } = await supabase
        .from('customer')
        .delete()
        .eq('custno', customerNo);
      
      if (error) throw error;
      
      toast.success("Customer deleted successfully");
      setDeleteDialogOpen(false);
      onDeleted();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer");
    } finally {
      setIsDeleting(false);
    }
  };

  // Force close dropdown when dialog is closed
  const handleDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setDropdownOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            onEdit();
            setDropdownOpen(false);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setDeleteDialogOpen(true);
              setDropdownOpen(false);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerActions;
