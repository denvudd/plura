import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  subAccountId?: string;
  description: string;
}) => {
  const authUser = await currentUser();
  let userData;

  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        agency: {
          subAccounts: {
            some: {
              id: subAccountId,
            },
          },
        },
      },
    });

    if (response) {
      userData = response;
    }
  } else {
    const response = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    });

    if (response) {
      userData = response;
    }
  }

  if (!userData) {
    throw new Error("Could not find a user");
  }

  let foundAgencyId = agencyId;

  if (!foundAgencyId) {
    if (!subAccountId) {
      throw new Error(
        "You need to provide at least an agency id or subaccount id"
      );
    }

    const response = await db.subAccount.findUnique({
      where: {
        id: subAccountId,
      },
    });

    if (response) {
      foundAgencyId = response.agencyId;
    }
  }

  if (subAccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        subAccount: {
          connect: {
            id: subAccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};