
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export interface InteractionType {
  id: number;
  type: "call" | "email" | "meeting" | "note";
  title: string;
  description: string;
  date: string;
  user: {
    name: string;
    imageUrl?: string;
  };
}

interface InteractionItemProps {
  interaction: InteractionType;
}

const typeIcons = {
  call: "🗣️",
  email: "📧",
  meeting: "🤝",
  note: "📝"
};

const typeColors = {
  call: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  email: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  meeting: "bg-green-100 text-green-800 hover:bg-green-200",
  note: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
};

const InteractionItem = ({ interaction }: InteractionItemProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formattedDate = formatDistanceToNow(new Date(interaction.date), { addSuffix: true });

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
              {typeIcons[interaction.type]}
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{interaction.title}</h4>
                <Badge className={typeColors[interaction.type]}>
                  {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            <p className="mt-1 text-sm">{interaction.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={interaction.user.imageUrl} alt={interaction.user.name} />
                <AvatarFallback>{getInitials(interaction.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">By {interaction.user.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractionItem;
