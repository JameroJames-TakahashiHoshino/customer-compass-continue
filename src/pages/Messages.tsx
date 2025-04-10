
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Search, Send, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type MessageType = {
  id: number;
  content: string;
  timestamp: string;
  from: "customer" | "me";
};

type Conversation = {
  customer: string;
  custno: string;
  lastMessage: string;
  lastActive: string;
  messages: MessageType[];
};

const MessagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [availableCustomers, setAvailableCustomers] = useState<{custno: string, custname: string}[]>([]);
  
  // Fetch customer data on initial load
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('customer')
          .select('custno, custname')
          .order('custname');
        
        if (error) throw error;
        
        // Prepare mock conversations using real customer data
        if (data && data.length > 0) {
          const customerConversations: Conversation[] = data.map((customer, idx) => ({
            customer: customer.custname || `Customer ${customer.custno}`,
            custno: customer.custno,
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
          
          setConversations(customerConversations);
          if (customerConversations.length > 0) {
            setActiveCustomer(customerConversations[0].customer);
          }
          
          setAvailableCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  const filteredConversations = conversations.filter(conv => 
    conv.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
    conv.lastMessage.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  
  const activeConversation = conversations.find(conv => conv.customer === activeCustomer) || conversations[0];
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (!activeConversation) {
      toast.error("Please select a conversation first");
      return;
    }
    
    const newMessages = [...(activeConversation.messages || [])];
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
    toast.success("Message sent");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.custno === selectedCustomer);
    if (existingConversation) {
      setActiveCustomer(existingConversation.customer);
      setNewChatOpen(false);
      return;
    }

    // Get customer name
    const customer = availableCustomers.find(c => c.custno === selectedCustomer);
    if (!customer) {
      toast.error("Customer not found");
      return;
    }

    // Create new conversation
    const newConversation: Conversation = {
      customer: customer.custname || `Customer ${customer.custno}`,
      custno: customer.custno,
      lastMessage: "No messages yet",
      lastActive: "Just now",
      messages: []
    };

    setConversations([newConversation, ...conversations]);
    setActiveCustomer(newConversation.customer);
    setNewChatOpen(false);
    setSelectedCustomer("");
    toast.success("New conversation started");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Your recent message threads</CardDescription>
              </div>
              <Button size="sm" onClick={() => setNewChatOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 dark:text-foreground dark:bg-background"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
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
            <CardTitle>{activeConversation?.customer || "Select a conversation"}</CardTitle>
            <CardDescription>
              {activeConversation ? `Last active: ${activeConversation.lastActive}` : "Start messaging with a customer"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {!activeConversation ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation or start a new one
              </div>
            ) : activeConversation.messages && activeConversation.messages.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Textarea 
                placeholder="Type your message..." 
                className="min-h-10 dark:text-foreground dark:bg-background" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={!activeConversation}
              />
              <Button 
                size="icon" 
                className="rounded-full" 
                onClick={handleSendMessage}
                disabled={!activeConversation}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Select a customer to start a new conversation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="customer-select">Customer</Label>
            <select 
              id="customer-select"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5 dark:text-foreground"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Select a customer</option>
              {availableCustomers.map(customer => (
                <option key={customer.custno} value={customer.custno}>
                  {customer.custname || `Customer ${customer.custno}`}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>Cancel</Button>
            <Button onClick={handleNewChat}>Start Conversation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesPage;
