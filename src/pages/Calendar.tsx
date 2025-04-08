
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, parse } from "date-fns";
import { CalendarRange, CalendarSearch } from "lucide-react";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [yearInput, setYearInput] = useState<string>(format(new Date(), "yyyy"));
  const [monthInput, setMonthInput] = useState<string>(format(new Date(), "MM"));
  const [dayInput, setDayInput] = useState<string>(format(new Date(), "dd"));
  
  const handleGoToDate = () => {
    try {
      // Validate inputs
      const year = parseInt(yearInput);
      const month = parseInt(monthInput) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dayInput);
      
      // Basic validation
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.error("Invalid date inputs");
        return;
      }
      
      if (year < 1900 || year > 2100 || month < 0 || month > 11 || day < 1 || day > 31) {
        console.error("Date out of acceptable range");
        return;
      }
      
      const newDate = new Date(year, month, day);
      
      // Check if date is valid
      if (isNaN(newDate.getTime())) {
        console.error("Invalid date");
        return;
      }
      
      setDate(newDate);
    } catch (error) {
      console.error("Error setting date:", error);
    }
  };
  
  const handleMonthChange = (value: string) => {
    // Validate month input (1-12)
    const month = parseInt(value);
    if ((month >= 1 && month <= 12) || value === "") {
      setMonthInput(value);
    }
  };
  
  const handleDayChange = (value: string) => {
    // Validate day input (1-31)
    const day = parseInt(value);
    if ((day >= 1 && day <= 31) || value === "") {
      setDayInput(value);
    }
  };
  
  const handleYearChange = (value: string) => {
    // Validate year input (1900-2100)
    const year = parseInt(value);
    if ((year >= 1900 && year <= 2100) || value === "" || isNaN(year)) {
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
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="w-[80px]"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Input
                    id="day"
                    value={dayInput}
                    onChange={(e) => handleDayChange(e.target.value)}
                    className="w-[80px]"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={yearInput}
                    onChange={(e) => handleYearChange(e.target.value)}
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
              onSelect={setDate}
              className="rounded-md border"
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
              {date ? date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'No Date Selected'}
            </CardTitle>
            <CardDescription>Events for this date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">No events scheduled for this date.</p>
                <Button variant="outline" size="sm">
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
