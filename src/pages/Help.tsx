
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Help = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted successfully!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I add a new customer?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Customers page and click on the "Add Customer" button. Fill in the required information and click "Save" to add a new customer to the system.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I record a new sale?</AccordionTrigger>
                <AccordionContent>
                  Go to the Sales page and click "New Sale". Select a customer, add products, specify quantities, and finalize the transaction. The system will automatically update inventory and customer records.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I process a payment?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Payments page and select "Record Payment". Choose the customer, enter the payment amount, select the payment method, and provide any necessary reference numbers.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I export my data to Excel?</AccordionTrigger>
                <AccordionContent>
                  Yes, most data tables in the system have an "Export" option that allows you to download the information in CSV or Excel format for further analysis or reporting.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I view a customer's transaction history?</AccordionTrigger>
                <AccordionContent>
                  Open the Customers page, locate the customer and click on their name or the "View Details" button. This will take you to the customer profile where you can see all their transactions, payments, and other information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">How can we help?</label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question"
                  className="min-h-32"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>Helpful guides and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">User Manual</h3>
                <p className="mb-4 text-sm">Comprehensive guide to all system features and functionality.</p>
                <Button variant="outline" className="w-full">Download PDF</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
                <p className="mb-4 text-sm">Step-by-step visual guides for common tasks and procedures.</p>
                <Button variant="outline" className="w-full">Watch Now</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Training Sessions</h3>
                <p className="mb-4 text-sm">Schedule personalized training with our support specialists.</p>
                <Button variant="outline" className="w-full">Book Session</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
