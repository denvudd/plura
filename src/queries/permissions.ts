"use server";

import { db } from "@/lib/db";
import { logger } from "@/lib/utils";

export const getUserWithPermissionsAndSubAccount = async (userId: string) => {
  try {
    const response = await db.user.findUnique({
      where: { id: userId },
      select: {
        permissions: {
          include: {
            subAccount: true,
          },
        },
      },
    });

    if (!response) throw new Error("No user found");

    return response;
  } catch (error) {
    logger(error);
  }
};

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  access: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: {
        id: permissionId,
      },
      update: {
        access,
      },
      create: {
        access,
        subAccountId,
        email: userEmail,
      },
    });

    if (!response)
      throw new Error("Could not update or create new permission for user");

    return response;
  } catch (error) {
    logger(error);
  }
};
