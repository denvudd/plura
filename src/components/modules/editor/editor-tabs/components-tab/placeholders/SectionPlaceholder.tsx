import React from "react";
import { BoxSelect } from "lucide-react";

interface SectionPlaceholderProps {}

const SectionPlaceholder: React.FC<SectionPlaceholderProps> = ({}) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("componentType", "section");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted/70 rounded-md p-2 flex items-center justify-center cursor-grab"
    >
      <BoxSelect className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default SectionPlaceholder;
