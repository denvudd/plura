import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { priceId, customerId } = await req.json();

  if (!customerId || !priceId) {
    return NextResponse.json("Customer ID or Price ID not found", {
      status: 400,
    });
  }

  const subscriptionExist = await db.agency.findFirst({
    where: {
      customerId,
    },
    include: {
      subscriptions: true,
    },
  });

  try {
    if (
      subscriptionExist?.subscriptions?.subscritiptionId &&
      subscriptionExist.subscriptions.active
    ) {
      // Update subscription
      // get current subscription
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExist.subscriptions.subscritiptionId,
      );

      const subsription = await stripe.subscriptions.update(
        subscriptionExist.subscriptions.subscritiptionId,
        {
          items: [
            {
              id: currentSubscriptionDetails.items.data[0].id,
              deleted: true,
            },
            {
              price: priceId,
            },
          ],
          expand: ["latest_invoice.payment_intent"],
        },
      );

      return NextResponse.json({
        subscriptionId: subsription.id,
        // @ts-expect-error Stripe TS don't recognize payment_intent because we set it ast string in expand property
        clientSecret: subsription.latest_invoice?.payment_intent.client_secret,
      });
    } else {
      // Create subscription
      console.log("Creating subscription...");

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        // Use default_incomplete to create Subscriptions with status=incomplete when the first invoice requires payment,
        // otherwise start as active.
        // Link: https://docs.stripe.com/api/subscriptions/create#create_subscription-payment_behavior
        payment_behavior: "default_incomplete",
        // Stripe sets subscription.default_payment_method when a subscription payment succeeds.
        // Link: https://docs.stripe.com/api/subscriptions/create#create_subscription-payment_settings-save_default_payment_method
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      });

      return NextResponse.json({
        subscriptionId: subscription.id,
        // @ts-expect-error Stripe TS don't recognize payment_intent because we set it ast string in expand property
        clientSecret: subscription.latest_invoice?.payment_intent.client_secret,
      });
    }
  } catch (error) {
    logger(error);

    return NextResponse.json("Internal server error", {
      status: 500,
    });
  }
}
