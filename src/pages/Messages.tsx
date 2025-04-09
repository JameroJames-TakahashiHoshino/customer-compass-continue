
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const customers = [
  "ABC Company", 
  "XYZ Corporation", 
  "Global Trading Inc.", 
  "City Merchants", 
  "Mountain Supplies LLC"
];

type MessageType = {
  id: number;
  content: string;
  timestamp: string;
  from: "customer" | "me";
};

type Conversation = {
  customer: string;
  lastMessage: string;
  lastActive: string;
  messages: MessageType[];
};

const initialConversations: Conversation[] = customers.map((customer, idx) => ({
  customer,
  lastMessage: idx % 2 === 0 
    ? "Hello, how are you doing today?" 
    : "Thanks for your message. Let me check that for you.",
  lastActive: idx === 0 ? "Just now" : `${idx}d ago`,
  messages: idx === 0 ? [
    {
      id: 1,
      content: "Hello, I wanted to ask about my recent order. When can I expect it to be delivered?",
      timestamp: "10:32 AM",
      from: "customer"
    },
    {
      id: 2,
      content: "Hi, thanks for reaching out. Your order #12345 is scheduled for delivery tomorrow between 9am and 12pm.",
      timestamp: "10:34 AM",
      from: "me"
    },
    {
      id: 3,
      content: "Perfect, thank you for the quick response!",
      timestamp: "10:36 AM",
      from: "customer"
    }
  ] : []
}));

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeCustomer, setActiveCustomer] = useState<string>(customers[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const filteredConversations = conversations.filter(conv => 
    conv.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
    conv.lastMessage.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  
  const activeConversation = conversations.find(conv => conv.customer === activeCustomer) || conversations[0];
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMessages = [...activeConversation.messages];
    newMessages.push({
      id: Date.now(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      from: "me"
    });
    
    const updatedConversations = conversations.map(conv => 
      conv.customer === activeCustomer 
        ? { 
            ...conv, 
            messages: newMessages,
            lastMessage: newMessage,
            lastActive: "Just now" 
          } 
        : conv
    );
    
    setConversations(updatedConversations);
    setNewMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle search term changes
  useEffect(() => {
    // No need for additional logic here as the filtering is done in the render
  }, [debouncedSearchTerm]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent message threads</CardDescription>
            <div className="mt-2">
              <Input 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center p-3 rounded-md cursor-pointer ${conv.customer === activeCustomer ? 'bg-accent' : 'hover:bg-muted'}`}
                    onClick={() => setActiveCustomer(conv.customer)}
                  >
                    <div className="flex-shrink-0 mr-3 bg-primary text-primary-foreground rounded-full p-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{conv.customer}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {conv.lastActive}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>{activeCustomer}</CardTitle>
            <CardDescription>Last active: {activeConversation.lastActive}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {activeConversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              activeConversation.messages.map(message => (
                <div key={message.id} className={`flex items-start ${message.from === "me" ? "justify-end" : "mb-4"}`}>
                  {message.from === "customer" && (
                    <div className="flex-shrink-0 mr-3 bg-muted rounded-full p-2">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`${message.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3 max-w-[80%]`}>
                    <p className="text-sm">{message.content}</p>
                    <span className={`text-xs ${message.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"} mt-1 block`}>{message.timestamp}</span>
                  </div>
                  {message.from === "me" && (
                    <div className="flex-shrink-0 ml-3 bg-primary text-primary-foreground rounded-full p-2">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Textarea 
                placeholder="Type your message..." 
                className="min-h-10" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button size="icon" className="rounded-full" onClick={handleSendMessage}>
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
