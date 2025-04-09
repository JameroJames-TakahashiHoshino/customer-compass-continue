
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarRange, CalendarSearch, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define event data structure
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  type: "event" | "activity";
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [yearInput, setYearInput] = useState<string>(format(new Date(), "yyyy"));
  const [monthInput, setMonthInput] = useState<string>(format(new Date(), "MM"));
  const [dayInput, setDayInput] = useState<string>(format(new Date(), "dd"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "event",
    date: new Date()
  });
  
  // Fetch events data from sales and activities
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('transno, salesdate, custno, customer:custno (custname)');
        
        if (salesError) throw salesError;
        
        // Process sales into events
        const salesEvents: CalendarEvent[] = salesData.map((sale: any) => ({
          id: `sale-${sale.transno}`,
          title: `Sale #${sale.transno}`,
          date: new Date(sale.salesdate),
          description: `Transaction with ${sale.customer?.custname || 'Customer #' + sale.custno}`,
          type: "event"
        }));
        
        // Fetch payment data for activities
        const { data: paymentData, error: paymentError } = await supabase
          .from('payment')
          .select('orno, paydate, transno, amount');
          
        if (paymentError) throw paymentError;
        
        // Process payments into activities
        const paymentEvents: CalendarEvent[] = paymentData.map((payment: any) => ({
          id: `payment-${payment.orno}`,
          title: `Payment #${payment.orno}`,
          date: new Date(payment.paydate),
          description: `Payment of ${payment.amount ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(payment.amount) : 'N/A'} for sale #${payment.transno || 'N/A'}`,
          type: "activity"
        }));
        
        // Combine all events and sort by date
        const allEvents = [...salesEvents, ...paymentEvents]
          .filter(event => isValid(event.date))
          .sort((a, b) => a.date.getTime() - b.date.getTime());
          
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Update current events whenever date changes
  useEffect(() => {
    if (date) {
      // Update calendar view to match the selected date
      document.querySelector('.rdp-caption')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Filter events for the selected date
      const selectedDateEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
      
      setCurrentEvents(selectedDateEvents);
    } else {
      setCurrentEvents([]);
    }
  }, [date, events]);

  const handleGoToDate = () => {
    try {
      // Validate month input
      if (!monthInput.match(/^(0?[1-9]|1[0-2])$/)) {
        toast.error("Month must be a number between 1-12");
        return;
      }
      
      // Validate day input
      if (!dayInput.match(/^(0?[1-9]|[12][0-9]|3[01])$/)) {
        toast.error("Day must be a number between 1-31");
        return;
      }
      
      // Validate year input
      if (!yearInput.match(/^\d{4}$/)) {
        toast.error("Year must be a 4-digit number");
        return;
      }
      
      // Validate inputs and parse into numbers
      const year = parseInt(yearInput);
      const month = parseInt(monthInput) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dayInput);
      
      // Additional validation
      if (year < 1900 || year > 2100) {
        toast.error("Year must be between 1900 and 2100");
        return;
      }
      
      // Create the date object
      const newDate = new Date(year, month, day);
      
      // Validate that the resulting date is valid
      // This catches invalid dates like February 30
      if (!isValid(newDate) || newDate.getMonth() !== month) {
        toast.error("The specified date is invalid");
        return;
      }
      
      // Valid date - update the state
      setDate(newDate);
      
      toast.success(`Navigated to ${format(newDate, "MMMM d, yyyy")}`);
    } catch (error) {
      console.error("Error setting date:", error);
      toast.error("Could not set the date. Please check your input.");
    }
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setYearInput(format(selectedDate, "yyyy"));
      setMonthInput(format(selectedDate, "MM"));
      setDayInput(format(selectedDate, "dd"));
    }
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input or numbers 1-12
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 12) || value.match(/^0[1-9]|1[0-2]$/)) {
      setMonthInput(value);
    }
  };
  
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input or numbers 1-31
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 31) || value.match(/^0[1-9]|[1-2][0-9]|3[0-1]$/)) {
      setDayInput(value);
    }
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers for year
    if (value === "" || value.match(/^\d{0,4}$/)) {
      setYearInput(value);
    }
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    setDate(today);
    setYearInput(format(today, "yyyy"));
    setMonthInput(format(today, "MM"));
    setDayInput(format(today, "dd"));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToDate();
    }
  };

  const showEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  const handleAddEventClick = () => {
    if (date) {
      setNewEvent({
        ...newEvent,
        date: date
      });
    }
    setAddEventOpen(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error("Event title is required");
      return;
    }

    // In a real app, we would save to database
    const eventToAdd: CalendarEvent = {
      id: `new-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      type: newEvent.type as "event" | "activity"
    };

    setEvents(prev => [...prev, eventToAdd]);
    
    if (
      eventToAdd.date.getDate() === date?.getDate() &&
      eventToAdd.date.getMonth() === date?.getMonth() &&
      eventToAdd.date.getFullYear() === date?.getFullYear()
    ) {
      setCurrentEvents(prev => [...prev, eventToAdd]);
    }

    setAddEventOpen(false);
    setNewEvent({
      title: "",
      description: "",
      type: "event",
      date: date || new Date()
    });

    toast.success("Event added successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to view events and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <div>
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    value={monthInput}
                    onChange={handleMonthChange}
                    onKeyPress={handleKeyPress}
                    className="w-[80px] dark:text-foreground dark:bg-background"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Input
                    id="day"
                    value={dayInput}
                    onChange={handleDayChange}
                    onKeyPress={handleKeyPress}
                    className="w-[80px] dark:text-foreground dark:bg-background"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={yearInput}
                    onChange={handleYearChange}
                    onKeyPress={handleKeyPress}
                    className="w-[100px] dark:text-foreground dark:bg-background"
                    placeholder="YYYY"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleGoToDate} className="flex-1">
                  <CalendarSearch className="mr-2 h-4 w-4" />
                  Go to Date
                </Button>
                <Button onClick={handleTodayClick} variant="outline">
                  Today
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
              month={date}
              onMonthChange={(newDate) => {
                setDate(newDate);
                setYearInput(format(newDate, "yyyy"));
                setMonthInput(format(newDate, "MM"));
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? format(date, "EEEE, MMMM d, yyyy") : 'No Date Selected'}
            </CardTitle>
            <CardDescription>Events and activities for this date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading events..." : 
                   currentEvents.length === 0 ? "No events or activities scheduled for this date." : 
                   `${currentEvents.length} item(s) scheduled`}
                </p>
                <Button variant="outline" size="sm" onClick={handleAddEventClick}>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              
              {currentEvents.length > 0 && (
                <div className="space-y-3 mt-4">
                  {currentEvents.map((event) => (
                    <Card key={event.id} className={`p-4 shadow-sm ${event.type === "event" ? "border-primary" : "border-secondary"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${event.type === "event" ? "bg-primary" : "bg-secondary"}`}></span>
                            <h3 className="font-medium">{event.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Type: {event.type === "event" ? "Sale" : "Payment"}</p>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => showEventDetails(event)}>Details</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={eventDetailsOpen} onOpenChange={setEventDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Event details for {selectedEvent?.date ? format(selectedEvent.date, "MMMM d, yyyy") : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <span className={`inline-block w-3 h-3 rounded-full ${selectedEvent?.type === "event" ? "bg-primary" : "bg-secondary"}`}></span>
              <span className="font-medium">{selectedEvent?.type === "event" ? "Sale" : "Payment"}</span>
            </div>
            <p>{selectedEvent?.description}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event or activity on {date ? format(date, "MMMM d, yyyy") : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input 
                id="event-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
                className="dark:text-foreground dark:bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select 
                value={newEvent.type} 
                onValueChange={(value) => setNewEvent({...newEvent, type: value})}
              >
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Sale</SelectItem>
                  <SelectItem value="activity">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Enter event description"
                className="dark:text-foreground dark:bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEventOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
