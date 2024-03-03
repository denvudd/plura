"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { type FunnelDetailsSchema } from "@/lib/validators/funnel-details";

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
