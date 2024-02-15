import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";

import { verifyInvintation } from "@/queries/invintations";
import { getNotification } from "@/queries/notifications";

import Sidebar from "@/components/sidebar/Sidebar";
import BlurPage from "@/components/global/BlurPage";
import InfoBar from "@/components/global/InfoBar";

interface AgencyIdLayoutProps extends React.PropsWithChildren {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyIdLayout: React.FC<AgencyIdLayoutProps> = async ({
  params,
  children,
}) => {
  const user = await currentUser();
  const agencyId = await verifyInvintation();

  if (!user) redirect("/");
  if (!agencyId || !params.agencyId) redirect("/agency");

  if (
    user.privateMetadata.role !== Role.AGENCY_OWNER &&
    user.privateMetadata.role !== Role.AGENCY_ADMIN
  ) {
    redirect("/agency/unauthorized");
  }

  const notifications = await getNotification(agencyId);

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={notifications} subAccountId={user.id} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default AgencyIdLayout;
