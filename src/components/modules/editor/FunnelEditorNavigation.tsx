"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowLeftCircle,
  Clock,
  Eye,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { type FunnelPage } from "@prisma/client";

import { upsertFunnelPage } from "@/queries/funnels";
import { saveActivityLogsNotification } from "@/queries/notifications";

import { useEditor } from "@/hooks/use-editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";

import { cn } from "@/lib/utils";
import { type DeviceTypes } from "@/lib/types/editor";

interface FunnelEditorNavigationProps {
  funnelId: string;
  subAccountId: string;
  funnelPageDetails: FunnelPage;
}

const FunnelEditorNavigation: React.FC<FunnelEditorNavigationProps> = ({
  funnelId,
  funnelPageDetails,
  subAccountId,
}) => {
  const router = useRouter();
  const { editor, dispatch } = useEditor();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: {
        funnelPageId: funnelPageDetails.id,
      },
    });
  }, [funnelPageDetails]);

  const handleBlurTitleChange = async (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    if (event.target.value === funnelPageDetails.name) return;

    if (event.target.value) {
      await upsertFunnelPage(subAccountId, funnelId, {
        id: funnelPageDetails.id,
        name: event.target.value,
        order: funnelPageDetails.order,
      });

      toast.success("Success", {
        description: "Saved funnel page title",
      });

      router.refresh();
    } else {
      toast.error("Oppse!", {
        description: "You need to have a title!",
      });
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleSave = async () => {
    setIsLoading(true);
    const content = JSON.stringify(editor.editor.elements);

    try {
      const response = await upsertFunnelPage(subAccountId, funnelId, {
        ...funnelPageDetails,
        content,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId,
      });

      dispatch({ type: "CLEAR_HISTORY" });

      toast.success("Success", {
        description: "Saved content",
      });

      router.refresh();
    } catch (error) {
      toast.error("Oopse!", {
        description: "Could not save content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleUndo();
    } else if (event.key === "y" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleRedo();
    } else if (event.key === "p" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handlePreviewClick();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  return (
    <TooltipProvider delayDuration={300}>
      <nav
        className={cn(
          "border-b flex items-center justify-between px-6 py-4 gap-2 transition-all",
          {
            "h-0 p-0 -mt-2 overflow-hidden": editor.editor.previewMode,
          }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[300px] w-full">
          <Link href={`/subaccount/${subAccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle aria-label="Back" />
          </Link>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2">
              <Input
                defaultValue={funnelPageDetails.name}
                onBlur={handleBlurTitleChange}
                className="border-none h-7 m-0 p-0 text-lg font-medium rounded-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Path: /{funnelPageDetails.pathName}
            </div>

            <span className="text-muted-foreground text-xs inline-flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {format(
                new Date(funnelPageDetails.updatedAt),
                "dd/MM/yyyy hh:mm a"
              )}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={editor.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: {
                  device: value as DeviceTypes,
                },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 gap-x-2 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0 border border-input bg-background"
                  >
                    <Laptop className="w-5 h-5" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0 border border-input bg-background"
                  >
                    <Tablet className="w-5 h-5" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0 border border-input bg-background"
                  >
                    <Smartphone className="w-5 h-5" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <ModeToggle className="h-10 w-10 rounded-md" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Color Mode</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviewClick}
              >
                <Eye className="w-5 h-5" aria-label="Preview" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="inline-flex items-center gap-2">
                Preview{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <div className="text-xs">⌘</div>P
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={editor.history.currentIndex > 0 === false}
                onClick={handleUndo}
                variant="outline"
                size="icon"
              >
                <Undo2 className="w-5 h-5" aria-label="Undo" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="inline-flex items-center gap-2">
                Undo{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <div className="text-xs">⌘</div>Z
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={
                  editor.history.currentIndex <
                    editor.history.history.length - 1 ===
                  false
                }
                onClick={handleRedo}
                variant="outline"
                size="icon"
              >
                <Redo2 className="w-5 h-5" aria-label="Redo" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="inline-flex items-center gap-2">
                Redo{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <div className="text-xs">⌘</div>Y
                </kbd>
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex flex-col gap-1 relative">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              disabled={isLoading}
              className={"w-24 px-0"}
            >
              Save{" "}
              {editor.history.history.length > 1 &&
                `(${editor.history.history.length <= 50 ? editor.history.history.length : "50+"})`}
            </Button>
          </div>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
