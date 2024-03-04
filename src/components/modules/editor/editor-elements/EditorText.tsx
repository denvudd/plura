'use client';

import React from "react";
import { Trash } from "lucide-react";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";

import type { EditorElement } from "@/lib/types/editor";
import { cn } from "@/lib/utils";

interface EditorTextProps {
  element: EditorElement;
}

const EditorText: React.FC<EditorTextProps> = ({ element }) => {
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleClickOnBody = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      className={cn("p-0.5 w-full m-1 relative text-base transition-all", {
        "border-blue-500 border-solid":
          editor.selectedElement.id === element.id,
        "border-dashed border": !editor.liveMode,
      })}
      style={element.styles}
      onClick={handleClickOnBody}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-6 -left-0.5 rounded-none rounded-t-lg">
          {editor.selectedElement.name}
        </Badge>
      )}
      <span
        contentEditable={!editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;

          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(element.content) && element.content.innerText && (
          <div className="absolute bg-primary px-2.5 text-xs font-bold -top-6 -right-0.5 rounded-none rounded-t-lg">
            <Trash
              className="cursor-pointer w-4 h-4"
              onClick={handleDeleteElement}
            />
          </div>
        )}
      </span>
    </div>
  );
};

export default EditorText;
