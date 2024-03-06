import { ImageIcon } from "lucide-react";
import React from "react";

interface ImagePlaceholderProps {}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({}) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("componentType", "image");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted/70 rounded-md p-2 flex items-center justify-center cursor-grab"
    >
      <ImageIcon className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default ImagePlaceholder;
