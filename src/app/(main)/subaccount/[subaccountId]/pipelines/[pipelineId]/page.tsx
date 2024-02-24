import React from "react";
import { redirect } from "next/navigation";

import { getPipelineDetails, getUserPipelines } from "@/queries/pipelines";
import {
  getLanesWithTicketsAndTags,
  updateLanesOrder,
  updateTicketsOrder,
} from "@/queries/lanes";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PipelineInfoBar from "@/components/modules/pipelines/PipelineInfoBar";
import PipelineSettings from "@/components/forms/PipelineSettings";
import PipelineView from "@/components/modules/pipelines/PipelineView";

interface PipelineIdPageProps {
  params: {
    subaccountId: string | undefined;
    pipelineId: string | undefined;
  };
}

const PipelineIdPage: React.FC<PipelineIdPageProps> = async ({ params }) => {
  const { subaccountId, pipelineId } = params;

  if (!subaccountId) redirect(`/subaccount/unauthorized`);
  if (!pipelineId) redirect(`/subaccount/${subaccountId}/pipelines`);

  const pipelineDetails = await getPipelineDetails(pipelineId);

  if (!pipelineDetails) {
    redirect(`/subaccount/${subaccountId}/pipelines`);
  }

  const allPipelines = await getUserPipelines(subaccountId);
  const lanes = await getLanesWithTicketsAndTags(pipelineId);

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b border-border rounded-none sm:flex-row flex-col gap-4 sm:gap-0 sm:h-16 h-auto w-full sm:justify-between mb-4 pb-4 sm:pb-0">
        <PipelineInfoBar
          pipelineId={pipelineId}
          subAccountId={subaccountId}
          pipelines={allPipelines}
        />
        <div className="flex items-center w-full sm:w-auto">
          <TabsTrigger value="view" className="sm:w-auto w-full">
            Pipeline View
          </TabsTrigger>
          <TabsTrigger value="settings" className="sm:w-auto w-full">
            Settings
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={pipelineId}
          subAccountId={subaccountId}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={pipelineId}
          pipelines={allPipelines}
          subaccountId={subaccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipelineIdPage;
