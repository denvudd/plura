import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { format } from "date-fns";
import { Clipboard, Contact2, DollarSign, ShoppingCart } from "lucide-react";

import { getSubAccountDetails } from "@/queries/subaccount";
import { getFunnels } from "@/queries/funnels";

import { AreaChart } from "@/components/ui/area-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleProgress } from "@/components/ui/circle-progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BadgeDelta } from "@/components/ui/badge-delta";
import PipelineValue from "@/components/modules/pipelines/PipelineValue";
import FunnelSubAccountChart from "@/components/modules/funnels/FunnelSubAccountChart";
import BlurPage from "@/components/common/BlurPage";

import { stripe } from "@/lib/stripe";
import { constructMetadata } from "@/lib/utils";

interface SubAccountPageIdProps {
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountPageId: React.FC<SubAccountPageIdProps> = async ({
  params,
}) => {
  const { subaccountId } = params;

  if (!subaccountId) redirect("/subaccount/unauthorized");

  let currency: string = "USD";
  let sessions: Stripe.Checkout.Session[] = [];
  let totalClosedSessions;
  let totalPendingSessions;
  let net: number = 0;
  let potentialIncome: number = 0;
  let closingRate: number = 0;

  const currentDate = new Date().getFullYear();
  const startDate = new Date(`${currentDate}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentDate}-12-31T23:59:59Z`).getTime() / 1000;

  const subAccountDetails = await getSubAccountDetails(subaccountId);

  if (!subAccountDetails) redirect("/subaccount/unauthorized");

  if (subAccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subAccountDetails.connectAccountId,
    });

    currency = response.default_currency?.toUpperCase() || "USD";

    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: {
          gte: startDate,
          lte: endDate,
        },
        limit: 100,
      },
      {
        stripeAccount: subAccountDetails.connectAccountId,
      }
    );

    sessions = checkoutSessions.data;

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date().toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date().toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    closingRate +
      (
        (totalClosedSessions.length / checkoutSessions.data.length) *
        100
      ).toFixed(2);
  }

  const funnels = await getFunnels(subaccountId);

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.funnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }));

  return (
    <BlurPage>
      <div className="relative h-full">
        {!subAccountDetails.connectAccountId && (
          <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Stripe</CardTitle>
                <CardDescription>
                  You need to connect your stripe account to see metrics
                </CardDescription>
                <Link
                  href={`/subaccount/${subAccountDetails.id}/launchpad`}
                  className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                >
                  <Clipboard />
                  Launch Pad
                </Link>
              </CardHeader>
            </Card>
          </div>
        )}
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Income</CardDescription>
                <CardTitle className="text-4xl">
                  {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {format(new Date(), "yyyy")}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Total revenue generated as reflected in your stripe dashboard.
              </CardContent>
              <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Potential Income</CardDescription>
                <CardTitle className="text-4xl">
                  {potentialIncome
                    ? `${currency} ${potentialIncome.toFixed(2)}`
                    : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {format(new Date(), "yyyy")}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                This is how much you can close.
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <PipelineValue subAccountId={subaccountId} />

            <Card className="xl:w-fit">
              <CardHeader>
                <CardDescription>Conversions</CardDescription>
                <CircleProgress
                  value={closingRate}
                  description={
                    <>
                      {sessions && (
                        <div className="flex flex-col">
                          Total Carts Opened
                          <div className="flex gap-2">
                            <ShoppingCart className="text-rose-700" />
                            {sessions.length}
                          </div>
                        </div>
                      )}
                      {totalClosedSessions && (
                        <div className="flex flex-col">
                          Won Carts
                          <div className="flex gap-2">
                            <ShoppingCart className="text-emerald-700" />
                            {totalClosedSessions.length}
                          </div>
                        </div>
                      )}
                    </>
                  }
                />
              </CardHeader>
            </Card>
          </div>

          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="relative">
              <CardHeader>
                <CardDescription>Funnel Performance</CardDescription>
              </CardHeader>
              <CardContent className=" text-sm text-muted-foreground flex flex-col gap-12 justify-between ">
                <FunnelSubAccountChart data={funnelPerformanceMetrics} />
                <div className="lg:w-[150px]">
                  Total page visits across all funnels. Hover over to get more
                  details on funnel page performance.
                </div>
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="p-4 flex-1">
              <CardHeader>
                <CardTitle>Checkout Activity</CardTitle>
              </CardHeader>
              <AreaChart
                className="text-sm stroke-primary"
                data={sessions || []}
                index="created"
                categories={["amount_total"]}
                colors={["primary"]}
                yAxisWidth={30}
                showAnimation={true}
              />
            </Card>
          </div>
          <div className="flex gap-4 xl:!flex-row flex-col">
            <Card className="p-4 flex-1 h-[450px] overflow-scroll relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transition History
                  <BadgeDelta
                    className="rounded-xl bg-transparent"
                    deltaType="moderateIncrease"
                    isIncreasePositive={true}
                    size="xs"
                  >
                    +12.3%
                  </BadgeDelta>
                </CardTitle>
                <Table>
                  <TableHeader className="!sticky !top-0">
                    <TableRow>
                      <TableHead className="w-[300px]">Email</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium truncate">
                    {totalClosedSessions
                      ? totalClosedSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              {session.customer_details?.email || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500 dark:text-black">
                                Paid
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(session.created), "dd/MM/yyyy hh:mm")}
                            </TableCell>

                            <TableCell className="text-right">
                              <small>{currency}</small>{" "}
                              <span className="text-emerald-500">
                                {session.amount_total}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      : "No Data"}
                  </TableBody>
                </Table>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </BlurPage>
  );
};

export default SubAccountPageId;

export const metadata = constructMetadata({
  title: "Dashboard - Plura",
});
