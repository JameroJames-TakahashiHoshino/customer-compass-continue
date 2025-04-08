
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";

const MessagesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent message threads</CardDescription>
            <div className="mt-2">
              <Input placeholder="Search conversations..." />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson"].map((name, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center p-3 rounded-md cursor-pointer ${idx === 0 ? 'bg-accent' : 'hover:bg-muted'}`}
                >
                  <div className="flex-shrink-0 mr-3 bg-primary text-primary-foreground rounded-full p-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {idx % 2 === 0 ? "Hello, how are you doing today?" : "Thanks for your message. Let me check that for you."}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {idx === 0 ? "Just now" : `${idx}d ago`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>John Smith</CardTitle>
            <CardDescription>Last active: Just now</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-3 bg-muted rounded-full p-2">
                <User className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">Hello, I wanted to ask about my recent order. When can I expect it to be delivered?</p>
                <span className="text-xs text-muted-foreground mt-1 block">10:32 AM</span>
              </div>
            </div>
            
            <div className="flex items-start justify-end mb-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">Hi John, thanks for reaching out. Your order #12345 is scheduled for delivery tomorrow between 9am and 12pm.</p>
                <span className="text-xs text-primary-foreground/70 mt-1 block">10:34 AM</span>
              </div>
              <div className="flex-shrink-0 ml-3 bg-primary text-primary-foreground rounded-full p-2">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-3 bg-muted rounded-full p-2">
                <User className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">Perfect, thank you for the quick response!</p>
                <span className="text-xs text-muted-foreground mt-1 block">10:36 AM</span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Textarea placeholder="Type your message..." className="min-h-10" />
              <Button size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
