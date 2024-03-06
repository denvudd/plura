import React from "react";
import { Youtube } from "lucide-react";

interface VideoPlaceholderProps {}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({}) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("componentType", "video");
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="w-14 h-14 bg-muted rounded-md flex items-center justify-center cursor-grab"
    >
      <Youtube className="w-10 h-10 text-muted-foreground" />
    </div>
  );
};

export default VideoPlaceholder;
