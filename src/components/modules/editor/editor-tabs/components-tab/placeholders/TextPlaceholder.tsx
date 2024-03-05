import React from "react";
import { TypeIcon } from "lucide-react";

interface TextPlaceholderProps {}

const TextPlaceholder: React.FC<TextPlaceholderProps> = (props) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", "text");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted rounded-md flex items-center justify-center cursor-grab"
    >
      <TypeIcon className="text-muted-foreground w-10 h-10" />
    </div>
  );
};

export default TextPlaceholder;
