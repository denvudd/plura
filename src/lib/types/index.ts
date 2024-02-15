import { getAuthUserDetails } from "@/queries/auth";
import { getUserWithPermissionsAndSubAccount } from "@/queries/permissions";

import type { Notification, Prisma, User } from "@prisma/client";

export type NotificationsWithUser =
  | ({ user: User } & Notification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserWithPermissionsAndSubAccount
>;

export type AuthUserWithAgencySidebarOptionsAndSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;
