
import { Table, Grid3X3 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

interface CustomerViewToggleProps {
  onViewChange: (view: "grid" | "table") => void;
  currentView: "grid" | "table";
}

const CustomerViewToggle = ({ onViewChange, currentView }: CustomerViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2 bg-muted/20 rounded-lg p-1">
      <Toggle
        variant="outline"
        size="sm"
        pressed={currentView === "grid"}
        onPressedChange={() => onViewChange("grid")}
        aria-label="Grid view"
      >
        <Grid3X3 className="h-4 w-4 mr-1" />
        <span className="text-xs">Grid</span>
      </Toggle>
      
      <Toggle
        variant="outline"
        size="sm"
        pressed={currentView === "table"}
        onPressedChange={() => onViewChange("table")}
        aria-label="Table view"
      >
        <Table className="h-4 w-4 mr-1" />
        <span className="text-xs">Table</span>
      </Toggle>
    </div>
  );
};

export default CustomerViewToggle;
