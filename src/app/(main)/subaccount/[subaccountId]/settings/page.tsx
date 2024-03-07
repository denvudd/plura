import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAuthUserDetails } from "@/queries/auth";
import { getSubAccountDetails } from "@/queries/subaccount";
import { getAgencyDetails } from "@/queries/agency";

import BlurPage from "@/components/common/BlurPage";
import SubAccountDetails from "@/components/forms/SubAccountDetails";
import { Agency } from "@prisma/client";
import { constructMetadata } from "@/lib/utils";

interface SubAccountSettingsPageProps {
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountSettingsPage: React.FC<SubAccountSettingsPageProps> = async ({
  params,
}) => {
  const { subaccountId } = params;
  const authUser = await currentUser();

  if (!subaccountId) redirect("/subaccount/unauthorized");
  if (!authUser) redirect("/agency/sign-in");

  const userDetails = await getAuthUserDetails();

  if (!userDetails) redirect("/subaccount/unauthorized");

  const subAccount = await getSubAccountDetails(subaccountId);

  if (!subAccount) redirect("/subaccount/unauthorized");

  const agencyDetails = await getAgencyDetails(subAccount.agencyId);

  return (
    <BlurPage>
      <div className="flex justify-center items-center mt-4">
        <div className="max-w-4xl w-full flex flex-col gap-8">
          <SubAccountDetails
            agencyDetails={agencyDetails as Agency}
            details={subAccount}
            userId={userDetails.id}
            userName={userDetails.name}
          />
        </div>
      </div>
    </BlurPage>
  );
};

export default SubAccountSettingsPage;

export const metadata = constructMetadata({
  title: "Settings - Plura",
});
