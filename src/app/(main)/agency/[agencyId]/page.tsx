import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { format } from "date-fns";
import {
  Clipboard,
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
} from "lucide-react";

import { getAgencyDetails } from "@/queries/agency";
import { getSubAccountsByAgency } from "@/queries/subaccount";

import { AreaChart } from "@/components/ui/area-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CircleProgress } from "@/components/ui/circle-progress";
import BlurPage from "@/components/common/BlurPage";

import { stripe } from "@/lib/stripe";

interface AgencyIdPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyIdPage: React.FC<AgencyIdPageProps> = async ({ params }) => {
  const { agencyId } = params;

  if (!agencyId) redirect("/agency/unauthorized");

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

  const agencyDetails = await getAgencyDetails(agencyId);

  if (!agencyDetails) redirect("/agency/unauthorized");

  const subAccounts = await getSubAccountsByAgency(agencyId);

  if (agencyDetails?.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
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
        stripeAccount: agencyDetails.connectAccountId,
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

  return (
    <BlurPage>
      <div className="relative h-full">
        {!agencyDetails.connectAccountId && (
          <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Stripe</CardTitle>
                <CardDescription>
                  You need to connect your stripe account to see metrics
                </CardDescription>
                <Link
                  href={`/agency/${agencyDetails.id}/launchpad`}
                  className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                >
                  <Clipboard />
                  Launch Pad
                </Link>
              </CardHeader>
            </Card>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <Separator className="mt-2 mb-6" />
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
              <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Active Clients</CardDescription>
                <CardTitle className="text-4xl">{subAccounts.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Reflects the number of sub accounts you own and manage.
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="flex-1 relative">
              <CardHeader>
                <CardTitle>Agency Goal</CardTitle>
                <CardDescription>
                  <p className="mt-2">
                    Reflects the number of sub accounts you want to own and
                    manage.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Current: {subAccounts.length}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Goal: {agencyDetails.goal}
                    </span>
                  </div>
                  <Progress
                    value={(subAccounts.length / agencyDetails.goal) * 100}
                  />
                </div>
              </CardFooter>
              <Goal className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
          </div>
          <div className="flex gap-4 xl:!flex-row flex-col">
            <Card className="p-4 flex-1">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <AreaChart
                className="text-sm stroke-primary"
                data={[
                  ...(totalClosedSessions || []),
                  ...(totalPendingSessions || []),
                ]}
                index="created"
                categories={["amount_total"]}
                colors={["primary"]}
                yAxisWidth={30}
                showAnimation={true}
              />
            </Card>
            <Card className="xl:w-[400px] w-full">
              <CardHeader>
                <CardTitle>Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <CircleProgress
                  value={closingRate}
                  description={
                    <>
                      {sessions && (
                        <div className="flex flex-col">
                          Abandoned
                          <div className="flex gap-2">
                            <ShoppingCart className="text-rose-700" />
                            {sessions.length}
                          </div>
                        </div>
                      )}
                      {totalClosedSessions && (
                        <div className="felx flex-col">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BlurPage>
  );
};

export default AgencyIdPage;
