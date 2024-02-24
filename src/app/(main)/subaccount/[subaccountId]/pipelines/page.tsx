import React from "react";
import { redirect } from "next/navigation";

import { createPipeline, getUserPipelines } from "@/queries/pipelines";
import { logger } from "@/lib/utils";

interface PipelinesPageProps {
  params: {
    subaccountId: string | undefined;
  };
}

const PipelinesPage: React.FC<PipelinesPageProps> = async ({ params }) => {
  const { subaccountId } = params;

  if (!subaccountId) redirect("/subaccount/unauthorized");

  const pipelineExists = await getUserPipelines(subaccountId);

  if (!!pipelineExists.length) {
    redirect(`/subaccount/${subaccountId}/pipelines/${pipelineExists[0].id}`);
  }

  const response = await createPipeline(subaccountId);

  if (response) {
    redirect(`/subaccount/${subaccountId}/pipelines/${response.id}`);
  }

  redirect("/error");
};
export default PipelinesPage;
