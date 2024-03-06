import { Columns3 } from "lucide-react";
import React from "react";

interface ThreeColumnsPlaceholderProps {}

const ThreeColumnsPlaceholder: React.FC<ThreeColumnsPlaceholderProps> = ({}) => {
  const handleDragState = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "3Col");
  };

  return (
    <div
      draggable
      onDragStart={handleDragState}
      className="h-14 w-14 bg-muted/70 rounded-md p-2 flex flex-row gap-[4px] cursor-grab"
    >
      <Columns3 className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default ThreeColumnsPlaceholder;
