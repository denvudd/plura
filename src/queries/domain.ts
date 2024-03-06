"use server";

import { db } from "@/lib/db";

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: {
      funnelPages: true,
    },
  });

  return response;
};
