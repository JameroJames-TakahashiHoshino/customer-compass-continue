
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string | null;
}

interface CalendarEventEditorProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
}

const CalendarEventEditor = ({ event, isOpen, onClose, onEventUpdated }: CalendarEventEditorProps) => {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState<Date | undefined>(
    event?.event_date ? new Date(event.event_date) : undefined
  );
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEditing = !!event;

  // Reset form when event changes
  useState(() => {
    setTitle(event?.title || "");
    setDescription(event?.description || "");
    setDate(event?.event_date ? new Date(event.event_date) : undefined);
  });

  const handleSave = async () => {
    if (!title || !date) {
      toast.error("Please provide a title and date");
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing && event) {
        // Update existing event
        const { error } = await supabase
          .from('calendar_events')
          .update({
            title,
            description,
            event_date: format(date, 'yyyy-MM-dd')
          })
          .eq('id', event.id);
          
        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        // Create new event
        const { error } = await supabase
          .from('calendar_events')
          .insert({
            title,
            description,
            event_date: format(date, 'yyyy-MM-dd'),
            event_type: 'event'
          });
            
        if (error) throw error;
        toast.success("Event created successfully");
      }
      
      onEventUpdated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !event) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast.success("Event deleted successfully");
      onEventUpdated();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Event" : "New Event"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to your event here." : "Add details for your new event."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {isEditing && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CalendarEventEditor;
