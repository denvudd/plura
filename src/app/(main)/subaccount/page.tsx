import React from "react";
import { verifyInvintation } from "@/queries/invintations";
import { redirect } from "next/navigation";
import { getAuthUserDetails } from "@/queries/auth";
import Unauthorized from "@/components/common/Unauthorized";

interface SubAccountPageProps {
  searchParams: {
    code: string | undefined;
    state: string | undefined;
  };
}

const SubAccountPage: React.FC<SubAccountPageProps> = async ({
  searchParams,
}) => {
  const { code, state } = searchParams;

  const agencyId = await verifyInvintation();

  if (!agencyId) redirect(`/subaccount/unauthorized`);
  console.log("agencyId", agencyId);

  const user = await getAuthUserDetails();
  if (!user) redirect(`/agency/sign-in`);

  if (state) {
    const statePath = state.split("___")[0];
    const stateSubAccountId = state.split("___")[1];

    if (!stateSubAccountId) redirect(`/agency/unauthorized`);

    redirect(`/subaccount/${stateSubAccountId}/${statePath}?code=${code}`);
  }

  const firstSubAccountWithAccess = user.permissions.find(
    (permission) => permission.access === true
  );

  console.log("user", user.permissions);

  if (firstSubAccountWithAccess) {
    redirect(`/subaccount/${firstSubAccountWithAccess.subAccountId}`);
  }

  console.log("firstSubAccountWithAccess", firstSubAccountWithAccess);
  console.log("user", user.permissions);

  return <Unauthorized />;
};

export default SubAccountPage;
