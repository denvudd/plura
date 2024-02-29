"use server";

import Stripe from "stripe";
import { db } from "@/lib/db";
import { Plan, Prisma } from "@prisma/client";
import { logger } from "@/lib/utils";

export const subscriptionCreate = async (
  subscription: Stripe.Subscription,
  customerId: string,
) => {
  try {
    const agency = await db.agency.findFirst({
      where: {
        customerId,
      },
      include: {
        subAccounts: true,
      },
    });

    if (!agency) {
      throw new Error("Could not find an agency to upsert the subscription");
    }

    const data: Prisma.SubscriptionUncheckedCreateInput = {
      active: subscription.status === "active",
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      // @ts-ignore
      priceId: subscription.plan.id,
      subscriptionId: subscription.id,
      // @ts-ignore
      plan: subscription.plan.id as Plan,
    };

    const response = await db.subscription.upsert({
      where: {
        agencyId: agency.id,
      },
      create: data,
      update: data,
    });

    return response;
  } catch (error) {
    logger(error);
  }
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
  const products = await stripe.products.list(
    {
      limit: 50,
      expand: ["data.default_price"],
    },
    {
      stripeAccount,
    },
  );

  return products.data;
};