import React from "react";
import { notFound, redirect } from "next/navigation";

import { getDomainContent } from "@/queries/domain";
import { updateFunnelPageVisits } from "@/queries/funnels";

import EditorProvider from "@/components/providers/EditorProvider";
import FunnelEditor from "@/components/modules/editor/FunnelEditor";

interface DomainPageProps {
  params: {
    domain: string | undefined;
  };
}

const DomainPage: React.FC<DomainPageProps> = async ({ params }) => {
  const { domain } = params;

  if (!domain) notFound();

  const domainData = await getDomainContent(domain.slice(0, -1));

  if (!domainData) notFound();

  const pageData = domainData.funnelPages.find((page) => !page.pathName);

  if (!pageData) notFound();

  await updateFunnelPageVisits(pageData.id);

  return (
    <EditorProvider
      subAccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        funnelPageDetails={pageData}
        liveMode
      />
    </EditorProvider>
  );
};

export default DomainPage;
