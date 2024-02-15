"use server";

import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Role, type User } from "@prisma/client";
import { logger } from "@/lib/utils";

export const getAuthUser = async (email: string) => {
  try {
    const details = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!details) {
      throw new Error("Not authorized");
    }

    return details as User;
  } catch (error) {
    logger(error);
  }
};

export const getAuthUserDetails = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      agency: {
        include: {
          sidebarOptions: true,
          subAccounts: {
            include: {
              sidebarOptions: true,
            },
          },
        },
      },
      permissions: true,
    },
  });

  return userData;
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null; // allready have an access

  const response = await db.user.create({
    data: {
      ...user,
    },
  });

  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();

  if (!user) {
    return new Error("User not found");
  }

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || Role.SUBACCOUNT_USER,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || Role.SUBACCOUNT_USER,
    },
  });

  return userData;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || Role.SUBACCOUNT_USER,
    },
  });

  return response;
};
