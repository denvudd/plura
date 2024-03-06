"use client";

import React from "react";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";
import EditorRecursive from "./EditorRecursive";

import { cn } from "@/lib/utils";
import { type EditorElement } from "@/lib/types/editor";

interface EditorTwoColumnsProps {
  element: EditorElement;
}

const EditorTwoColumns: React.FC<EditorTwoColumnsProps> = ({ element }) => {
  const { id, content, type } = element;
  const { editor: editorState, dispatch } = useEditor();
  const { editor } = editorState;

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
      onClick={handleOnClickBody}
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
