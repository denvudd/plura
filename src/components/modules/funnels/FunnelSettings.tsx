import React from "react";
import { type Funnel } from "@prisma/client";
import { redirect } from "next/navigation";

import { getConnectAccountProducts } from "@/lib/stripe/stripe-actions";
import { getSubAccountDetails } from "@/queries/subaccount";

import FunnelDetails from "@/components/forms/FunnelDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelProductsTable from "./FunnelProductsTable";

interface FunnelSettingsProps {
  subAccountId: string;
  defaultData: Funnel;
}

const FunnelSettings: React.FC<FunnelSettingsProps> = async ({
  subAccountId,
  defaultData,
}) => {
  // WIP: go connect your stripe to sell products
  const subaccountDetails = await getSubAccountDetails(subAccountId);

  if (!subaccountDetails) redirect("/subaccount/unauthorized");
  if (!subaccountDetails.connectAccountId)
    redirect(`/subaccount/${subAccountId}/launchpad`);

  const products = await getConnectAccountProducts(
    subaccountDetails.connectAccountId
  );

  return (
    <div className="flex gap-4 flex-col max-w-4xl w-full mx-auto items-center">
      <Card className="flex-1 flex-shrink w-full">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FunnelProductsTable defaultData={defaultData} products={products} />
        </CardContent>
      </Card>

      <FunnelDetails subAccountId={subAccountId} defaultData={defaultData} />
    </div>
  );
};

export default FunnelSettings;
