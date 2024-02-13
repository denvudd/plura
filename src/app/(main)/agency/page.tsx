import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAuthUserDetails } from "@/queries/auth";
import { verifyInvintation } from "@/queries/invintations";

interface AgencyPageProps {}

const AgencyPage: React.FC<AgencyPageProps> = async ({}) => {
  const authUser = await currentUser();

  if (!authUser) return redirect("/sign-in");

  const agencyId = await verifyInvintation();
  const user = await getAuthUserDetails();

  return <div className="">page</div>;
};

export default AgencyPage;
