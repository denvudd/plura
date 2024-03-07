import { Stripe } from "stripe";
import { getAuthUserDetails } from "@/queries/auth";
import { getSubAccountWithContacts } from "@/queries/contacts";
import { getMedia } from "@/queries/media";
import { getUserWithPermissionsAndSubAccount } from "@/queries/permissions";
import { getPipelineDetails, getPipelines } from "@/queries/pipelines";
import { getTicketDetails, getTicketsWithTags } from "@/queries/tickets";
import { getFunnels } from "@/queries/funnels";

import type {
  Contact,
  Lane,
  Notification,
  Prisma,
  Tag,
  Ticket,
  User,
} from "@prisma/client";

export type NotificationsWithUser =
  | ({ user: User } & Notification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserWithPermissionsAndSubAccount
>;

export type AuthUserWithAgencySidebarOptionsAndSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type MediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubAccountInput;

export type TicketAndTags = Ticket & {
  tags: Tag[];
  assigned: User | null;
  customer: Contact | null;
};

export type LaneDetails = Lane & {
  tickets: TicketAndTags[];
};

export type TicketDetails = Prisma.PromiseReturnType<typeof getTicketDetails>;

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketsWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;

export type SubAccountWithContacts = Prisma.PromiseReturnType<
  typeof getSubAccountWithContacts
>;

export type ShippingAddress = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: ShippingAddress;
  name: string;
};

export type StripeCustomer = {
  email: string;
  name: string;
  shipping: ShippingInfo;
  address: ShippingAddress;
};

export type PriceList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount = Prisma.PromiseReturnType<typeof getFunnels>[0];

export type PipelinesWithLanesAndTickets = Prisma.PromiseReturnType<typeof getPipelines>
