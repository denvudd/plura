"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Plan } from "@prisma/client";
import { toast } from "sonner";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { getStripe } from "@/lib/stripe/stripe-client";

import { useModal } from "@/hooks/use-modal";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionDetails from "@/components/forms/SubscriptionDetails";
import Loading from "@/components/ui/loading";

import { cn } from "@/lib/utils";
import { PRICING } from "@/config/pricing";

interface SubscriptionFormWrapperProps {
  customerId: string;
  isPlanExists: boolean;
}

const SubscriptionFormWrapper: React.FC<SubscriptionFormWrapperProps> = ({
  customerId,
  isPlanExists,
}) => {
  const router = useRouter();
  const { setClose, data } = useModal();

  const [selectedPriceId, setSelectedPriceId] = React.useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = React.useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ clientSecret: "", subscriptionId: "" });

  const stripeOptions: StripeElementsOptions = React.useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription]
  );

  React.useEffect(() => {
    if (!selectedPriceId) return;

    const createSecret = async () => {
      const subscriptionResponse = await fetch(
        "/api/stripe/create-subscription",
        {
          method: "POST",
          headers: {
            "Contet-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: selectedPriceId,
            customerId,
          }),
        }
      );

      const subscriptionResponseData = await subscriptionResponse.json();
      setSubscription({
        clientSecret: subscriptionResponseData.clientSecret as string,
        subscriptionId: subscriptionResponseData.subscriptionId as string,
      });

      if (isPlanExists) {
        toast("Success", {
          description: "Your plan has been successfully upgraded!",
        });
        setClose();
        router.refresh();
      }
    };

    createSecret();
  }, [data, selectedPriceId, customerId]);

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plans?.plans.map((plan) => (
          <Card
            key={plan.id}
            onClick={() => setSelectedPriceId(plan.id as Plan)}
            className={cn("relative cursor-pointer transition-all", {
              "border-primary": selectedPriceId === plan.id,
            })}
          >
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <h4 className="text-2xl font-semibold">${plan.unit_amount ? plan.unit_amount / 100 : "0"}</h4>
                <p className="text-sm text-muted-foreground">{plan.nickname}</p>
                <p className="text-sm text-muted-foreground">
                  {PRICING.find((p) => p.priceId === plan.id)?.description}
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === plan.id && (
              <div className="w-3 h-3 bg-emerald-500 rounded-full absolute top-4 right-4" />
            )}
          </Card>
        ))}

        {stripeOptions.clientSecret && !isPlanExists && (
          <>
            <h1 className="text-xl">Payment Method</h1>
            <Elements stripe={getStripe()} options={stripeOptions}>
              <SubscriptionDetails selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}

        {!stripeOptions.clientSecret && selectedPriceId && (
          <div className="flex items-center justify-center w-full h-40">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
