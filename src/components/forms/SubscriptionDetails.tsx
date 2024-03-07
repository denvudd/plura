"use client";

import React from "react";
import { toast } from "sonner";
import { Plan } from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "../ui/button";

interface SubscriptionDetailsProps {
  selectedPriceId: string | Plan;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  selectedPriceId,
}) => {
  const stripeElements = useElements();
  const stripeHook = useStripe();

  const [priceError, setPriceError] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedPriceId) {
      setPriceError("You need to select a plan to subscribe");
      return null;
    }

    setPriceError("");
    event.preventDefault();

    if (!stripeHook || !stripeElements) {
      setPriceError("Something went wrong... Please try again");
      return null;
    }

    try {
      const { error } = await stripeHook.confirmPayment({
        elements: stripeElements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });

      if (error) {
        throw new Error();
      }

      toast.success("Payment successfull!", {
        description: "Your payment has been successfully processed.",
      });
    } catch (error) {
      toast.error("Payment failed", {
        description:
          "We could not process your payment. Please try a different card.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {priceError && <small className="text-destructive">{priceError}</small>}
      <PaymentElement />
      <Button disabled={!stripeHook} className="mt-4 w-full" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default SubscriptionDetails;
