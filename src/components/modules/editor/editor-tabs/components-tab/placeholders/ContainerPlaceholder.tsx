import React from "react";
import { Box } from "lucide-react";

interface ContainerPlaceholderProps {}

const ContainerPlaceholder: React.FC<ContainerPlaceholderProps> = ({}) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("componentType", "container");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-muted/70 rounded-md p-2 flex items-center justify-center cursor-grab"
    >
      <Box className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default ContainerPlaceholder;
