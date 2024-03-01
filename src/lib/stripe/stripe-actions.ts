"use server";

import Stripe from "stripe";
import { stripe as StripeInstance } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Plan, Prisma } from "@prisma/client";
import { logger } from "@/lib/utils";
import { ADD_ONS } from "@/config/add-ons";

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
      subscritiptionId: subscription.id,
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
  const products = await StripeInstance.products.list(
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

export const getAddOnsProducts = async () => {
  const addOnsProducts = await StripeInstance.products.list({
    ids: ADD_ONS.map((addOne) => addOne.id),
    expand: ["data.default_price"],
  });

  return addOnsProducts;
};

export const getPrices = async () => {
  const prices = await StripeInstance.prices.list({
    product: process.env.NEXT_PUBLIC_PLURA_PRODUCT_ID,
    active: true,
  });

  return prices;
};

export const getCharges = async (customerId: string | undefined) => {
  const charges = await StripeInstance.charges.list({
    limit: 50,
    customer: customerId,
  })

  return charges;
}
