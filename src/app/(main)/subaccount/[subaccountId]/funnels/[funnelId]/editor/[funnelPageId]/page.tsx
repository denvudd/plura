import React from "react";
import { redirect } from "next/navigation";

import { getFunnelPageDetails } from "@/queries/funnels";

import EditorProvider from "@/components/providers/EditorProvider";
import FunnelEditorNavigation from "@/components/modules/editor/FunnelEditorNavigation";
import FunnelEditorSidebar from "@/components/modules/editor/FunnelEditorSidebar";
import FunnelEditor from "@/components/modules/editor/FunnelEditor";

interface FunnelIdEditorPageProps {
  params: {
    funnelId: string | undefined;
    funnelPageId: string | undefined;
    subaccountId: string | undefined;
  };
}

const FunnelIdEditorPage: React.FC<FunnelIdEditorPageProps> = async ({
  params,
}) => {
  const { funnelId, funnelPageId, subaccountId } = params;

  if (!subaccountId) redirect("/subaccount/unauthorized");
  if (!funnelId || !funnelPageId) {
    redirect(`/subaccount/${subaccountId}/funnels`);
  }

  const funnelPageDetails = await getFunnelPageDetails(funnelPageId);

  if (!funnelPageDetails) {
    redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`);
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subAccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={funnelId}
          funnelPageDetails={funnelPageDetails}
          subAccountId={subaccountId}
        />
        <FunnelEditor
          funnelPageId={funnelPageId}
          funnelPageDetails={funnelPageDetails}
        />
        <FunnelEditorSidebar subAccountId={subaccountId} />
      </EditorProvider>
    </div>
  );
};

export default FunnelIdEditorPage;
