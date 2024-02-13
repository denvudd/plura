import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { createTeamUser } from "./auth";
import { saveActivityLogsNotification } from "./notifications";

import { Role } from "@prisma/client";

export const verifyInvintation = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const invintationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

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
    }
  }
};
