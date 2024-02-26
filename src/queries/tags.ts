"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const upsertTag = async (
  subAccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const response = await db.tag.upsert({
    where: {
      id: tag.id || uuidv4(),
      subAccountId,
    },
    update: tag,
    create: {
      ...tag,
      subAccountId,
    },
  });

  return response;
};

export const getTagsForSubAccount = async (subAccountId: string) => {
  const response = await db.tag.findMany({
    where: {
      subAccountId,
    },
  });

  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({
    where: {
      id: tagId,
    },
  });

  return response;
};
