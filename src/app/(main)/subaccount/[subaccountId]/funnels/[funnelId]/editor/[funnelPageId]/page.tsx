import React from "react";
import { redirect } from "next/navigation";

import { getFunnelPageDetails } from "@/queries/funnels";

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
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden"></div>
  );
};

export default FunnelIdEditorPage;
