import React from "react";
import {
  type AgencySidebarOption,
  type SubAccountSidebarOption,
} from "@prisma/client";

import { getAuthUserDetails } from "@/queries/auth";

import MenuOptions from "./MenuOptions";

interface SidebarProps {
  id: string;
  type: "agency" | "subaccount";
}

const Sidebar: React.FC<SidebarProps> = async ({ id, type }) => {
  const user = await getAuthUserDetails();

  if (!user || !user.agency) return null;

  const details =
    type === "agency"
      ? user.agency
      : user?.agency.subAccounts.find((subAccount) => subAccount.id === id);
  const isWhiteLabelAgency = user.agency.whiteLabel;

  if (!details) return null;

  let sideBarLogo: string = user.agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelAgency && type === "subaccount") {
    const subAccountLogo = user?.agency.subAccounts.find(
      (subAccount) => subAccount.id === id
    )?.subAccountLogo;

    sideBarLogo = subAccountLogo || user.agency.agencyLogo;
  }

  let sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[] = [];

  if (type === "agency") {
    sidebarOptions = user.agency.sidebarOptions || [];
  } else {
    const subAccount = user.agency.subAccounts.find(
      (subaccount) => subaccount.id === id
    );

    sidebarOptions = subAccount?.sidebarOptions || [];
  }

  const subAccounts = user.agency.subAccounts.filter((subAccount) =>
    user.permissions.find(
      (permission) =>
        permission.subAccountId === subAccount.id && permission.access === true
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
      <MenuOptions
        defaultOpen={false}
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
