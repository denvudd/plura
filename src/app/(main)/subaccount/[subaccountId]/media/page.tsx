import React from "react";
import { redirect } from "next/navigation";

import { getMedia } from "@/queries/media";

import BlurPage from "@/components/common/BlurPage";
import Media from "@/components/modules/media/Media";

interface MediaPageProps {
  params: {
    subaccountId: string | undefined;
  };
}

const MediaPage: React.FC<MediaPageProps> = async ({ params }) => {
  const { subaccountId } = params;

  if (!subaccountId) redirect(`/subaccount/unauthorized`);

  const media = await getMedia(subaccountId);

  return (
    <BlurPage>
      <Media data={media} subAccountId={subaccountId} />
    </BlurPage>
  );
};

export default MediaPage;
