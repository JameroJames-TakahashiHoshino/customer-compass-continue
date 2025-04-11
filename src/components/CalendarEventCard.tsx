
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CalendarEventDialog from "./CalendarEventDialog";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onDelete: (id: string) => void;
  onEdit: (event: CalendarEvent) => void;
}

const CalendarEventCard = ({ event, onDelete, onEdit }: CalendarEventCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!event.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', event.id);
        
      if (error) throw error;
      
      onDelete(event.id);
      toast.success("Event deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEditSubmit = (updatedEvent: CalendarEvent) => {
    onEdit(updatedEvent);
    setShowEditDialog(false);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>
                {formatDate(event.event_date)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{event.description || "No description provided."}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground">
            Type: {event.event_type || "Event"}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CalendarEventDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        defaultValues={event}
        isEditing={true}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default CalendarEventCard;
