"use server";

import { db } from "@/lib/db";
import { CreateFunnelSchema } from "@/lib/validators/create-funnel";
import { v4 as uuidv4 } from "uuid";

export const upsertFunnel = async (
  subAccountId: string,
  funnel: CreateFunnelSchema & { liveProducts: string },
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
