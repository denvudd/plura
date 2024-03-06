"use client";

import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/hooks/use-editor";
import { EditorElement } from "@/lib/types/editor";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import React from "react";

interface EditorVideoProps {
  element: EditorElement;
}

const EditorVideo: React.FC<EditorVideoProps> = ({ element }) => {
  const { editor: editorState, dispatch } = useEditor();
  const { editor } = editorState;

  const handleClickOnBody = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={element.styles}
      draggable
      onClick={handleClickOnBody}
      className={cn(
        "p-1 w-full m-1 relative text-base transition-all flex items-center justify-center",
        {
          "border-blue-500 border-solid":
            editor.selectedElement.id === element.id,
          "border-dashed border": !editor.liveMode,
        }
      )}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-6 -left-0.5 rounded-none rounded-t-md">
          {editor.selectedElement.name}
        </Badge>
      )}

      {!Array.isArray(element.content) && (
        <iframe
          width={element.styles.width || "560"}
          height={element.styles.height || "315"}
          src={element.content.src}
          title="Youtube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}

      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash
            className="cursor-pointer w-4 h-4"
            onClick={handleDeleteElement}
          />
        </div>
      )}
    </div>
  );
};

export default EditorVideo;
