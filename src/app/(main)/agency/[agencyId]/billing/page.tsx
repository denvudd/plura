import React from "react";
import { redirect } from "next/navigation";

import {
  getAddOnsProducts,
  getCharges,
  getPrices,
} from "@/lib/stripe/stripe-actions";
import { getAgencySubscription } from "@/queries/agency";

import { PRICING } from "@/config/pricing";
import { Separator } from "@/components/ui/separator";
import PricingCard from "@/components/modules/billing/PricingCard";
import { formatPrice } from "@/lib/utils";

interface AgencyBillingPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyBillingPage: React.FC<AgencyBillingPageProps> = async ({
  params,
}) => {
  const { agencyId } = params;

  if (!agencyId) redirect("/agency/unauthorized");

  // WIP: Create more add-ons products
  const addOns = await getAddOnsProducts();
  const agencySubscription = await getAgencySubscription(agencyId);

  const prices = await getPrices();
  const currentPlanDetails = PRICING.find(
    (price) => price.priceId === agencySubscription?.subscriptions?.priceId
  );

  const charges = await getCharges(agencySubscription?.customerId);
  const allCharges = [
    ...charges.data.map((charge) => ({
      id: charge.id,
      description: charge.description,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(charge.created * 1000).toLocaleDateString()}`,
      status: "Paid",
      amount: `$${charge.amount / 100}`,
    })),
  ];

  const amt =
    agencySubscription?.subscriptions?.active && currentPlanDetails?.price
      ? formatPrice(currentPlanDetails?.price)
      : "$0";

  const buttonCta = agencySubscription?.subscriptions?.active
    ? "Change Plan"
    : "Get Started";

  const description =
    agencySubscription?.subscriptions?.active && currentPlanDetails?.description
      ? currentPlanDetails?.description
      : "Lets get started! Pick a plan that works best for you!";

  const title =
    agencySubscription?.subscriptions?.active === true &&
    currentPlanDetails?.title
      ? currentPlanDetails?.title
      : "Starter";

  const starterFeatures =
    PRICING.find((feature) => feature.title === "Starter")?.features || [];

  const features =
    agencySubscription?.subscriptions?.active && currentPlanDetails?.features
      ? currentPlanDetails.features
      : starterFeatures;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Billing</h1>
      <Separator className="mb-6" />
      <h2 className="text-2xl mb-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          isPlanExists={Boolean(agencySubscription?.subscriptions?.active)}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ""}
          amt={amt}
          buttonCta={buttonCta}
          highlightDescription="Want to modify your plan? You can do this here. If you have further question please, contact support@plura.com"
          description={description}
          title={title}
          highlightTitle="Plan Options"
          duration="/ month"
          features={features}
        />
      </div>
    </>
  );
};

export default AgencyBillingPage;
