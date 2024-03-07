import React from "react";
import { PlusCircle } from "lucide-react";

import { getFunnels } from "@/queries/funnels";

import FunnelDetails from "@/components/forms/FunnelDetails";
import BlurPage from "@/components/common/BlurPage";
import FunnelsDataTable from "./data-table";
import { columns } from "./columns";
import { constructMetadata } from "@/lib/utils";

interface FunnelsPageProps {
  params: {
    subaccountId: string;
  };
}

const FunnelsPageProps: React.FC<FunnelsPageProps> = async ({ params }) => {
  const funnels = await getFunnels(params.subaccountId);

  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <PlusCircle className="w-4 h-4" />
            Create Funnel
          </>
        }
        modalChildren={<FunnelDetails subAccountId={params.subaccountId} />}
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default FunnelsPageProps;

export const metadata = constructMetadata({
  title: "Funnels - Plura",
});
