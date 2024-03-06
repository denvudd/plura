"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";
import EditorRecursive from "./EditorRecursive";

import { defaultStyles } from "@/config/editor";
import { cn } from "@/lib/utils";
import { type EditorBtns, type EditorElement } from "@/lib/types/editor";

interface EditorTwoColumnsProps {
  element: EditorElement;
}

const EditorTwoColumns: React.FC<EditorTwoColumnsProps> = ({ element }) => {
  const { id, content, type } = element;
  const { editor: editorState, dispatch } = useEditor();
  const { editor } = editorState;

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();

    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Component" },
              id: uuidv4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Two Columns",
              styles: { ...defaultStyles },
              type: "2Col",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={element.styles}
      className={cn("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "border-blue-500":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-solid":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-dashed border": !editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
          {editor.selectedElement.name}
        </Badge>
      )}
      
      {Array.isArray(content) &&
        content.map((childElement) => (
          <EditorRecursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default EditorTwoColumns;
