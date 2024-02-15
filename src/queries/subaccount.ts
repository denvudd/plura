"use server";

import { db } from "@/lib/db";
import { Role, type SubAccount } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;

  const agencyOwner = await db.user.findFirst({
    where: {
      agency: {
        id: subAccount.agencyId,
      },
      role: Role.AGENCY_OWNER,
    },
  });

  if (!agencyOwner) {
    throw new Error("Could not create subaccount");
  }

  const permissionId = uuidv4();

  const response = await db.subAccount.upsert({
    where: {
      id: subAccount.id,
    },
    update: subAccount,
    create: {
      ...subAccount,
      permissions: {
        create: {
          id: permissionId,
          access: true,
          email: agencyOwner.email,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      pipelines: {
        create: {
          name: "Lead Cycle",
        },
      },
      sidebarOptions: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
    },
  });

  return response;
};
