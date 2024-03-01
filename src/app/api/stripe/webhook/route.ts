import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { subscriptionCreate } from "@/lib/stripe/stripe-actions";
import { logger } from "@/lib/utils";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;

  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE
    ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!signature || !webhookSecret) {
      logger("❌ Missing Stripe signature or webhook secret");
      return NextResponse.json(
        { error: "Missing Stripe signature or webhook secret" },
        { status: 400 }
      );
    }

    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    logger("❌ Webhook signature verification failed.");
    return NextResponse.json(
      {
        error: `Webhook signature verification failed. Webhook error: ${error.message}`,
      },
      { status: 400 }
    );
  }

  try {
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;

      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreate(
                subscription,
                subscription.customer as string
              );
              logger("Created from Stripe webhook", subscription);
            } else {
              logger(
                "❌ Skipped at created from Stripe webhook because subscription is inactive",
                subscription
              );
              break;
            }
          }
          default: {
            logger("❌ Unhandled relevant event!", stripeEvent.type);
          }
        }
      } else {
        logger(
          "❌ Skipped from webhook because subscription was from a connected account not for the application",
          subscription
        );
      }
    }
  } catch (error) {
    logger("❌ Webhook handler failed.", error);
    return new NextResponse("❌ Webhook handler failed.", {
      status: 400,
    });
  }

  return NextResponse.json(
    {
      webhookActionReceived: true,
    },
    {
      status: 200,
    }
  );
}
