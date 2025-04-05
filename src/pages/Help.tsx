
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Send, Mail, Phone } from "lucide-react";

export default function Help() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ
            </CardTitle>
            <CardDescription>Frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse our most common questions to quickly find answers.
            </p>
            <Button variant="outline" className="w-full">View FAQs</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </CardTitle>
            <CardDescription>Contact via email</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Send us an email and we'll respond within 24 hours.
            </p>
            <Button variant="outline" className="w-full">Email Us</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Phone Support
            </CardTitle>
            <CardDescription>Talk to our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Call us directly at (800) 123-4567 during business hours.
            </p>
            <Button variant="outline" className="w-full">Call Now</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
          <CardDescription>Find quick answers to frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add a new customer?</AccordionTrigger>
              <AccordionContent>
                To add a new customer, navigate to the Customers section and click the "Add Customer" button. Fill in the required information and click "Save" to create the customer record.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How can I export customer data?</AccordionTrigger>
              <AccordionContent>
                You can export customer data by going to the Customers Table view, clicking on the "Export" button, and selecting your preferred format (CSV, Excel, or PDF).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I record a new payment?</AccordionTrigger>
              <AccordionContent>
                To record a new payment, go to the Payments section and click "Add Payment". Select the customer, enter the payment amount and details, then click "Save Payment".
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I customize the dashboard?</AccordionTrigger>
              <AccordionContent>
                Yes, you can customize the dashboard by clicking the "Customize" button in the top right corner of the dashboard. From there, you can add, remove, or rearrange widgets to suit your needs.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I reset my password?</AccordionTrigger>
              <AccordionContent>
                To reset your password, click on the "Reset Password" link on the login page. Enter your email address and follow the instructions sent to your email to create a new password.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Send us a message and we'll get back to you</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input 
                  id="name" 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input 
                id="subject" 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={4} 
                className="w-full p-2 border rounded-md"
                placeholder="Please describe your issue in detail"
              />
            </div>
            <Button className="w-full md:w-auto flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
