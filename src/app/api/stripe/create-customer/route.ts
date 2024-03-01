import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import type { StripeCustomer } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { email, address, name, shipping }: StripeCustomer = await req.json();

  if (!email || !address || !name || !shipping) {
    return NextResponse.json("Missing required fields", {
      status: 400,
    });
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      address,
      shipping,
    });

    return NextResponse.json({
      customerId: customer.id,
    });
  } catch (error) {
    logger(error);

    return NextResponse.json("Internal server error", {
      status: 500,
    });
  }
}
