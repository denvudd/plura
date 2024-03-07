import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { getFunnel } from "@/queries/funnels";
import { upsertContact } from "@/queries/contacts";
import { saveActivityLogsNotification } from "@/queries/notifications";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";
import EditorContactForm from "@/components/forms/EditorContactForm";

import { cn } from "@/lib/utils";
import type { EditorElement } from "@/lib/types/editor";
import type { ContactDetailsSchema } from "@/lib/validators/contact-details";

interface EditorContactForm {
  element: EditorElement;
}

const EditorContact: React.FC<EditorContactForm> = ({ element }) => {
  const router = useRouter();
  const {
    dispatch,
    editor: editorState,
    subAccountId,
    funnelId,
    pageDetails,
  } = useEditor();
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

  const goToNextPage = async () => {
    if (!editor.liveMode) return undefined;

    const funnelPages = await getFunnel(funnelId);

    if (!funnelPages || !pageDetails) return undefined;

    if (funnelPages.funnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.funnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );

      if (!nextPage) return undefined;

      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const onFormSubmit = async (values: ContactDetailsSchema) => {
    if (editor.liveMode || editor.previewMode) {
      try {
        const response = await upsertContact({
          ...values,
          subAccountId,
        });

        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `A New contact signed up | ${response?.name}`,
          subAccountId,
        });

        toast.success("Success", {
          description: "Successfully saved your info",
        });

        await goToNextPage();
      } catch (error) {
        toast.error("Failed", {
          description: "Could not save your information",
        });
      }
    }
  };

  return (
    <div
      onClick={handleOnClickBody}
      className={cn(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "border-blue-500": editor.selectedElement.id === element.id,

          "border-solid": editor.selectedElement.id === element.id,
          "!border-dashed !border": !editor.liveMode,
        }
      )}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
          {editor.selectedElement.name}
        </Badge>
      )}

      {!Array.isArray(element.content) && (
        <EditorContactForm
          title={element.content.formTitle as string}
          subTitle={element.content.formDescription as string}
          buttonText={element.content.formButton as string}
          styles={element.styles}
          apiCall={onFormSubmit}
        />
      )}
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={handleDeleteElement}
          />
        </div>
      )}
    </div>
  );
};

export default EditorContact;
