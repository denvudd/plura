import { useEditor } from "@/hooks/use-editor";
import { EditorElement } from "@/lib/types/editor";
import { cn } from "@/lib/utils";
import React from "react";

interface EditorContainerProps {
  element: EditorElement;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ element }) => {
  const { content, id, name, styles, type } = element;
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;

  return (
    <div
      style={styles}
      className={cn("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-scroll ": type === "__body",
        "flex flex-col md:flex-row": type === "2Col",
        "border-blue-500":
          editor.selectedElement.id === id &&
          editor.liveMode &&
          editor.selectedElement.type !== "__body",
        "border-yellow-400 border-4":
          editor.selectedElement.id === id &&
          editor.liveMode &&
          editor.selectedElement.type === "__body",
        "border-solid": editor.selectedElement.id === id && editor.liveMode,
        "border-dashed border": editor.liveMode,
      })}
    >
      EditorContainer
    </div>
  );
};

export default EditorContainer;
