import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getFunnel } from "@/queries/funnels";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurPage from "@/components/common/BlurPage";
import FunnelSettings from "@/components/modules/funnels/FunnelSettings";
import FunnelSteps from "@/components/modules/funnels/FunnelSteps";

import { cn, constructMetadata } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FunnelsForSubAccount } from "@/lib/types";

interface FunnelIdPageProps {
  params: {
    funnelId: string | undefined;
    subaccountId: string | undefined;
  };
}

const FunnelIdPage: React.FC<FunnelIdPageProps> = async ({ params }) => {
  const { funnelId, subaccountId } = params;

  if (!subaccountId) redirect("/subaccount/unauthorized");
  if (!funnelId) redirect(`/subaccount/${subaccountId}/funnels`);

  const funnelPages = await getFunnel(funnelId);

  if (!funnelPages) redirect(`/subaccount/${subaccountId}/funnels`);

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${subaccountId}/funnels`}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "mb-4 inline-flex items-center gap-2"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none sm:flex-row flex-col gap-4 sm:gap-0 sm:h-16 h-auto w-full sm:justify-between mb-4 pb-4 sm:pb-0">
          <h1 className="text-3xl font-bold mb-4 text-secondary-foreground">{funnelPages.name}</h1>
          <div className="flex items-center w-full sm:w-auto">
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subAccountId={subaccountId}
            initialPages={funnelPages.funnelPages}
            funnelId={funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subAccountId={subaccountId}
            defaultData={funnelPages}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelIdPage;

export const metadata = constructMetadata({
  title: "Funnel - Plura",
});
