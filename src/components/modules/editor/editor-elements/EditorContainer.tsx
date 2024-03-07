import React from "react";
import { Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";
import EditorRecursive from "./EditorRecursive";

import { defaultStyles } from "@/config/editor";
import { cn } from "@/lib/utils";
import type { EditorBtns, EditorElement } from "@/lib/types/editor";
import { addVerifyElement } from "@/lib/editor/add-verify-element";

interface EditorContainerProps {
  element: EditorElement;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ element }) => {
  const { content, id, styles, type } = element;
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;

  const handleOnDrop = (event: React.DragEvent) => {
    event.stopPropagation();
    const componentType = event.dataTransfer.getData(
      "componentType"
    ) as EditorBtns;

    addVerifyElement(componentType, id, dispatch)
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleOnClickBody = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={styles}
      className={cn(
        "relative p-4 transition-all group scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium",
        {
          "max-w-full w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full w-full overflow-y-auto overflow-x-hidden": type === "__body",
          "flex flex-col md:!flex-row": type === "2Col",
          "!border-blue-500":
            editor.selectedElement.id === id &&
            !editor.liveMode &&
            editor.selectedElement.type !== "__body",
          "!border-yellow-400 border-4":
            editor.selectedElement.id === id &&
            !editor.liveMode &&
            editor.selectedElement.type === "__body",
          "!mb-[200px]":
            !editor.liveMode && !editor.previewMode && type === "__body",
          "!border-solid": editor.selectedElement.id === id && !editor.liveMode,
          "!border-dashed !border": !editor.liveMode,
        }
      )}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      onClick={handleOnClickBody}
    >
      <Badge
        className={cn(
          "absolute -top-6 -left-0.5 rounded-none rounded-t-md hidden",
          {
            block: editor.selectedElement.id === element.id && !editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((child) => (
          <EditorRecursive key={child.id} element={child} />
        ))}

      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        editor.selectedElement.type !== "__body" && (
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

export default EditorContainer;
