
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone } from "lucide-react";

export interface CustomerType {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  lastContact: string;
  imageUrl?: string;
  company?: string;
}

interface CustomerCardProps {
  customer: CustomerType;
}

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
};

const CustomerCard = ({ customer }: CustomerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={customer.imageUrl} alt={customer.name} />
              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  <Link to={`/customers/${customer.id}`} className="hover:text-primary hover:underline">
                    {customer.name}
                  </Link>
                </h3>
                <Badge className={statusColors[customer.status]}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </div>
              {customer.company && (
                <p className="text-sm text-muted-foreground">{customer.company}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Last contacted: {customer.lastContact}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-3">
        <div className="flex w-full justify-between gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/customers/${customer.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm">
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerCard;
