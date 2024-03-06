import React from "react";
import { Link2Icon } from "lucide-react";

interface LinkPlaceholderProps {}

const LinkPlaceholder: React.FC<LinkPlaceholderProps> = () => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "link");
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab"
    >
      <Link2Icon className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default LinkPlaceholder;
