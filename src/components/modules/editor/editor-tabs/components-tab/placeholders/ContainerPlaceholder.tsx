import React from "react";

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
      <div className="border-dashed border h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
    </div>
  );
};

export default ContainerPlaceholder;
