
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: CalendarEvent;
  isEditing?: boolean;
  onSubmit: (event: CalendarEvent) => void;
}

const CalendarEventDialog = ({ 
  open, 
  onOpenChange, 
  defaultValues = { title: "", description: "", event_date: new Date().toISOString().split('T')[0], event_type: "event" },
  isEditing = false,
  onSubmit
}: CalendarEventDialogProps) => {
  const [event, setEvent] = useState<CalendarEvent>(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && event.id) {
        const { error } = await supabase
          .from('calendar_events')
          .update({
            title: event.title,
            description: event.description,
            event_date: event.event_date,
            event_type: event.event_type
          })
          .eq('id', event.id);
          
        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        const { data, error } = await supabase
          .from('calendar_events')
          .insert([
            {
              title: event.title,
              description: event.description,
              event_date: event.event_date,
              event_type: event.event_type
            }
          ])
          .select('*')
          .single();
          
        if (error) throw error;
        event.id = data.id;
        toast.success("Event created successfully");
      }
      
      onSubmit(event);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Make changes to your event here. Click save when you're done."
              : "Fill in the details for your new event."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                value={event.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={event.description || ""}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event_date" className="text-right">Date</Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                value={event.event_date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event_type" className="text-right">Type</Label>
              <Select 
                value={event.event_type || "event"} 
                onValueChange={(value) => handleSelectChange("event_type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save changes" : "Create event")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventDialog;
