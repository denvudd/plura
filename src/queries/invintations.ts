"use server";

import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { createTeamUser } from "./auth";
import { saveActivityLogsNotification } from "./notifications";

import { Role } from "@prisma/client";
import { logger } from "@/lib/utils";

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user?.role === role) {
    throw new Error("This user already have this role");
  }
  
  const resposne = await db.invitation.create({
    data: { email, agencyId, role },
  });

  try {
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      ignoreExisting: true,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
  } catch (error) {
    logger(error);
    throw error;
  }

  return resposne;
};

export const verifyInvintation = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const invintationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  // check if user exist already to avoid duplicates users
  const isUserExist = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (isUserExist) {
    return isUserExist.agencyId;
  }

  if (invintationExists) {
    const userDetails = await createTeamUser(invintationExists.agencyId, {
      id: user.id,
      role: invintationExists.role,
      email: invintationExists.email,
      agencyId: invintationExists.agencyId,
      avatarUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invintationExists?.agencyId,
      description: "Joined",
      subAccountId: undefined,
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || Role.SUBACCOUNT_USER,
        },
      });

      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return userDetails.agencyId;
    }

    return null;
  }

  const agency = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return agency ? agency.agencyId : null;
};
