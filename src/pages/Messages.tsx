
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, MessageSquare, User, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_name: string;
}

interface Conversation {
  id: string;
  customer_id: string;
  customer_name: string;
  last_message: string;
  updated_at: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [customers, setCustomers] = useState<{custno: string, custname: string}[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [newConversationDialogOpen, setNewConversationDialogOpen] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // This is a mock implementation - in real app, you'd fetch from the database
        const mockConversations: Conversation[] = [
          {
            id: "1",
            customer_id: "C001",
            customer_name: "Acme Corp",
            last_message: "Thank you for your order",
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            customer_id: "C002",
            customer_name: "TechSolutions Inc",
            last_message: "When can we expect delivery?",
            updated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ];
        
        setConversations(mockConversations);
        
        // Fetch customers for new conversation dialog
        const { data, error } = await supabase
          .from('customer')
          .select('custno, custname');
        
        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);
  
  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      // This is a mock implementation - in real app, you'd fetch from the database
      const mockMessages: Message[] = [
        {
          id: "101",
          content: "Hello, I wanted to discuss our recent order",
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          sender_id: "customer",
          sender_name: conversationId === "1" ? "Acme Corp" : "TechSolutions Inc"
        },
        {
          id: "102",
          content: "Hi there! What can I help you with?",
          created_at: new Date(Date.now() - 3540000).toISOString(), // 59 min ago
          sender_id: "staff",
          sender_name: "Support Team"
        },
        {
          id: "103",
          content: conversationId === "1" 
            ? "Thank you for your order" 
            : "When can we expect delivery?",
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          sender_id: conversationId === "1" ? "staff" : "customer",
          sender_name: conversationId === "1" ? "Support Team" : (conversationId === "2" ? "TechSolutions Inc" : "")
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;
    
    setSendingMessage(true);
    try {
      // In a real app, you'd save to the database here
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        created_at: new Date().toISOString(),
        sender_id: "staff",
        sender_name: "Support Team"
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Update the last message in conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation 
            ? {...conv, last_message: newMessage, updated_at: new Date().toISOString()} 
            : conv
        )
      );
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleCreateConversation = async () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    
    setCreatingConversation(true);
    try {
      // Find the selected customer name
      const customer = customers.find(c => c.custno === selectedCustomer);
      
      if (!customer) {
        throw new Error("Selected customer not found");
      }
      
      // In a real app, you'd create a conversation in the database here
      const newConversation: Conversation = {
        id: Date.now().toString(),
        customer_id: selectedCustomer,
        customer_name: customer.custname || selectedCustomer,
        last_message: "New conversation started",
        updated_at: new Date().toISOString()
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation.id);
      setNewConversationDialogOpen(false);
      
      toast.success(`Started conversation with ${customer.custname}`);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast.error(error.message || "Failed to create conversation");
    } finally {
      setCreatingConversation(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Left sidebar - Conversations */}
        <div className="col-span-1 border rounded-lg flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <Dialog open={newConversationDialogOpen} onOpenChange={setNewConversationDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Conversation</DialogTitle>
                  <DialogDescription>
                    Select a customer to start a conversation with.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.custno} value={customer.custno}>
                          {customer.custname || customer.custno}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateConversation} 
                    disabled={creatingConversation || !selectedCustomer}
                  >
                    {creatingConversation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Conversation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No conversations found</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => setNewConversationDialogOpen(true)}
                >
                  Start a new conversation
                </Button>
              </div>
            ) : (
              conversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-3 cursor-pointer rounded-md hover:bg-accent mb-1 ${currentConversation === conversation.id ? 'bg-accent/80' : ''}`}
                  onClick={() => setCurrentConversation(conversation.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{conversation.customer_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{conversation.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conversation.last_message}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right side - Messages */}
        <div className="col-span-1 lg:col-span-2 border rounded-lg flex flex-col">
          {currentConversation ? (
            <>
              {/* Message header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {conversations.find(c => c.id === currentConversation)?.customer_name.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">
                      {conversations.find(c => c.id === currentConversation)?.customer_name || 'Customer'}
                    </h2>
                  </div>
                </div>
              </div>
              
              {/* Message content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === 'staff' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender_id === 'staff' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender_id !== 'staff' && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{message.sender_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">{formatDate(message.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={sendingMessage || !newMessage.trim()}>
                    {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="mb-4">Select a conversation from the list or start a new one</p>
              <Button 
                onClick={() => setNewConversationDialogOpen(true)}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for the Label
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
  >
    {children}
  </label>
);

export default Messages;
