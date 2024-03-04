"use client";

import React from "react";
import { EyeOff } from "lucide-react";
import { type FunnelPage } from "@prisma/client";

import { useEditor } from "@/hooks/use-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FunnelEditorProps {
  funnelPageId: string;
  liveMode?: boolean;
  funnelPageDetails: FunnelPage;
}

const FunnelEditor: React.FC<FunnelEditorProps> = ({
  funnelPageId,
  liveMode,
  funnelPageDetails,
}) => {
  const { editor, dispatch } = useEditor();

  React.useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  React.useEffect(() => {
    if (!funnelPageDetails) return undefined;

    dispatch({
      type: "LOAD_DATA",
      payload: {
        elements: funnelPageDetails.content
          ? JSON.parse(funnelPageDetails.content)
          : "",
        withLive: !!liveMode,
      },
    });
  }, [funnelPageId]);

  const handleClickElement = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handlePreview = () => {
    dispatch({ type: "TOGGLE_LIVE_MODE" });
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
  };

  return (
    <div className="h-full flex justify-center z-[999999] relative">
      <div
        className={cn(
          "use-automation-zoom-in h-screen overflow-auto mr-[385px] z-[999999] bg-background transition-all rounded-md",
          {
            "p-0 mr-0":
              editor.editor.previewMode === true ||
              editor.editor.liveMode === true,
            "!w-[850px]": editor.editor.device === "Tablet",
            "!w-[420px]": editor.editor.device === "Mobile",
            "!w-full": editor.editor.device === "Desktop",
          }
        )}
        onClick={handleClickElement}
      >
        {editor.editor.previewMode && editor.editor.liveMode && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 left-4 z-[100]"
            onClick={handlePreview}
            title="Back to editor"
          >
            <EyeOff aria-label="Back to editor" className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FunnelEditor;
