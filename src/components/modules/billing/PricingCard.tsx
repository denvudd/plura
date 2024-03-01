"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { useModal } from "@/hooks/use-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/common/CustomModal";
import SubscriptionFormWrapper from "@/app/(main)/agency/[agencyId]/billing/_components/SubscriptionFormWrapper";

import type { PriceList } from "@/lib/types";

interface PricingCardProps {
  features: string[];
  buttonCta: string;
  title: string;
  description: string;
  amt: string;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  customerId: string;
  prices: PriceList["data"];
  isPlanExists: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  amt,
  buttonCta,
  customerId,
  description,
  duration,
  features,
  highlightDescription,
  highlightTitle,
  isPlanExists,
  prices,
  title,
}) => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const { setOpen } = useModal();

  const handleManagePlan = async () => {
    setOpen(
      <CustomModal
        title="Manage Your Plan"
        subTitle="You can change your plan at any time from the billings settings"
        scrollShadow={false}
      >
        <SubscriptionFormWrapper
          customerId={customerId}
          isPlanExists={isPlanExists}
        />
      </CustomModal>,
      async () => ({
        plans: {
          defaultPriceId: plan ? plan : "",
          plans: prices,
        },
      })
    );
  };

  return (
    <Card className="flex flex-col justify-between lg:w-1/2">
      <div className="">
        <CardHeader className="flex flex-col lg:!flex-row lg:items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <p className="text-6xl font-bold min-w-[117px]">
            {amt}
            <small className="text-sm font-light text-muted-foreground">
              {duration}
            </small>
          </p>
        </CardHeader>
        <CardContent>
          <ul>
            {features.map((feature) => (
              <li
                key={feature}
                className="list-disc ml-4 text-muted-foreground"
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Card className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between rounded-lg border gap-4 p-4">
              <div>
                <p>{highlightTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {highlightDescription}
                </p>
              </div>

              <Button className="md:w-fit w-full" onClick={handleManagePlan}>
                {buttonCta}
              </Button>
            </div>
          </Card>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PricingCard;
