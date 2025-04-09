
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarRange, CalendarSearch } from "lucide-react";
import { toast } from "sonner";

// Mock event data structure
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [yearInput, setYearInput] = useState<string>(format(new Date(), "yyyy"));
  const [monthInput, setMonthInput] = useState<string>(format(new Date(), "MM"));
  const [dayInput, setDayInput] = useState<string>(format(new Date(), "dd"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  
  // Mock events data - in a real app this would come from a database
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: "1",
        title: "Client Meeting",
        date: new Date(2025, 3, 10), // April 10, 2025
        description: "Discuss project requirements with new client"
      },
      {
        id: "2",
        title: "Follow-up Call",
        date: new Date(2025, 3, 12), // April 12, 2025
        description: "Call with marketing team about campaign updates"
      },
      {
        id: "3", 
        title: "Product Demo",
        date: new Date(2025, 3, 15), // April 15, 2025
        description: "Show new features to potential clients"
      },
      {
        id: "4",
        title: "Team Meeting",
        date: new Date(), // Today
        description: "Weekly team sync meeting"
      }
    ];
    
    setEvents(mockEvents);
  }, []);
  
  // Update current events whenever date changes
  useEffect(() => {
    if (date) {
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
      // First, validate each piece separately
      if (!yearInput.match(/^\d{4}$/)) {
        toast.error("Year must be a 4-digit number");
        return;
      }
      
      if (!monthInput.match(/^(0?[1-9]|1[0-2])$/)) {
        toast.error("Month must be a number between 1-12");
        return;
      }
      
      if (!dayInput.match(/^(0?[1-9]|[12][0-9]|3[01])$/)) {
        toast.error("Day must be a number between 1-31");
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
      
      // Also update the calendar view to match the selected date
      setTimeout(() => {
        // Force calendar to update to the new month/year
        const calendarElement = document.querySelector('.rdp-month');
        if (calendarElement) {
          calendarElement.setAttribute('data-year', year.toString());
          calendarElement.setAttribute('data-month', month.toString());
        }
      }, 50);
      
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to view or add events</CardDescription>
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
                    className="w-[80px]"
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
                    className="w-[80px]"
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
                    className="w-[100px]"
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
            <CardDescription>Events for this date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {currentEvents.length === 0 ? "No events scheduled for this date." : `${currentEvents.length} event(s) scheduled`}
                </p>
                <Button variant="outline" size="sm">
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              
              {currentEvents.length > 0 && (
                <div className="space-y-3 mt-4">
                  {currentEvents.map((event) => (
                    <Card key={event.id} className="p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost" className="text-destructive">Delete</Button>
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
    </div>
  );
};

export default CalendarPage;
