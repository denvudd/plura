"use server";

import { db } from "@/lib/db";
import { CreateMediaType } from "@/lib/types";

export const getMedia = async (subAccountId: string) => {
  const mediaFiles = await db.subAccount.findUnique({
    where: {
      id: subAccountId,
    },
    include: {
      media: true,
    },
  });

  return mediaFiles;
};

export const createMedia = async (
  subAccountId: string,
  mediaFiles: CreateMediaType
) => {
  const { link, name } = mediaFiles;

  const response = await db.media.create({
    data: {
      subAccountId,
      link,
      name,
    },
  });

  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });

  return response;
};
