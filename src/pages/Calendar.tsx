
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import CalendarEventEditor from "@/components/CalendarEventEditor";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string | null;
}

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);

  // Function to get events for the selected date
  const getEventsForDate = (date: Date | undefined): CalendarEvent[] => {
    if (!date) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.event_date === dateStr);
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(date);

  // Fetch all events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');

      if (error) throw error;
      
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to get dates with events for the calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.event_date));
  };

  // Function to handle clicking on an event
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventEditorOpen(true);
  };

  // Function to handle adding a new event
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventEditorOpen(true);
  };

  // Function called after an event is added, updated or deleted
  const handleEventUpdated = () => {
    fetchEvents();
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View and manage your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={{ before: new Date('2021-01-01') }}
                modifiers={{
                  booked: getDatesWithEvents()
                }}
                modifiersStyles={{
                  booked: { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </span>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Events for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled for this day
                <div className="mt-4">
                  <Button variant="outline" onClick={handleAddEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between p-4">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEventClick(event)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Badge variant="outline">{event.event_type || 'event'}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CalendarEventEditor
        event={selectedEvent}
        isOpen={isEventEditorOpen}
        onClose={() => setIsEventEditorOpen(false)}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default Calendar;
