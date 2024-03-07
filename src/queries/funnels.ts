"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { type FunnelDetailsSchema } from "@/lib/validators/funnel-details";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getFunnels = async (subAccountId: string) => {
  const response = await db.funnel.findMany({
    where: {
      subAccountId,
    },
    include: {
      funnelPages: true,
    },
  });

  return response;
};

export const getFunnel = async (funnelId: string) => {
  const response = await db.funnel.findUnique({
    where: {
      id: funnelId,
    },
    include: {
      funnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return response;
};

export const upsertFunnel = async (
  subAccountId: string,
  funnel: FunnelDetailsSchema & { liveProducts: string },
  funnelId: string
) => {
  const response = await db.funnel.upsert({
    where: {
      id: funnelId,
    },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || uuidv4(),
      subAccountId,
    },
  });

  return response;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const response = await db.funnel.update({
    where: {
      id: funnelId,
    },
    data: {
      liveProducts: products,
    },
  });

  return response;
};

export const upsertFunnelPage = async (
  subAccountId: string,
  funnelId: string,
  funnelPage: Prisma.FunnelPageCreateWithoutFunnelInput
) => {
  if (!subAccountId || !funnelId) return undefined;

  const response = await db.funnelPage.upsert({
    where: {
      id: funnelPage.id || "",
    },
    update: funnelPage,
    create: {
      ...funnelPage,
      funnelId,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
    },
  });

  // reset page cache
  revalidatePath(`/subaccount/${subAccountId}/funnels/${funnelId}`);

  return response;
};

export const deleteFunnelPage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({
    where: {
      id: funnelPageId,
    },
  });

  return response;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findFirst({
    where: {
      id: funnelPageId,
    },
  });

  return response;
};

export const updateFunnelPageVisits = async (funnelPageId: string) => {
  const response = await db.funnelPage.update({
    where: {
      id: funnelPageId,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  return response;
};