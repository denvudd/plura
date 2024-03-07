"use client";

import { useEditor } from "@/hooks/use-editor";
import { EditorElement } from "@/lib/types/editor";
import { FunnelPage } from "@prisma/client";
import React from "react";
import EditorLayersTree from "../editor-layers/EditorLayersTree";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface LayersTabProps {}

const LayersTab: React.FC<LayersTabProps> = () => {
  const { pageDetails, dispatch, editor } = useEditor();
  const [elements, setElements] = React.useState<EditorElement[]>(
    (JSON.parse(pageDetails?.content || "[]")[0].content as EditorElement[]) ||
      []
  );

  const handleSelectElement = (element: EditorElement | undefined) => {
    if (element) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  React.useEffect(() => {
    if (editor.editor.elements.length) {
      setElements(editor.editor.elements);
    }
  }, [editor.editor.elements]);

  return (
    <div className="min-h-[900px] overflow-auto px-6">
      <SheetHeader className="text-left py-6">
        <SheetTitle>Layers</SheetTitle>
        <SheetDescription>
          View the editor in a tree like structure.
        </SheetDescription>
      </SheetHeader>
      <EditorLayersTree
        data={elements}
        className="flex-shrink-0"
        onSelectChange={handleSelectElement}
      />
    </div>
  );
};

export default LayersTab;
