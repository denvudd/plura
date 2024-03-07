import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { stripe } from "@/lib/stripe";
import { cn, constructMetadata, formatPrice } from "@/lib/utils";

interface PaymentSuccessfullPageProps {
  searchParams: {
    payment_intent: string | undefined;
    payment_intent_client_secret: string | undefined;
    redirect_status: string | undefined;
  };
}

// WIP
const PaymentSuccessfullPage: React.FC<PaymentSuccessfullPageProps> = async ({
  searchParams,
}) => {
  const { payment_intent, payment_intent_client_secret, redirect_status } =
    searchParams;

  if (!payment_intent || !payment_intent_client_secret || !redirect_status) {
    redirect("/");
  }

  const intent = await stripe.paymentIntents.retrieve(payment_intent);
  const invoice = await stripe.invoices.retrieve(intent.invoice as string);

  return (
    <div className="p-4 my-4 text-center w-screen flex justify-center items-center flex-col gap-4 max-w-2xl mx-auto">
      <div>
        <p className="text-sm font-medium text-green-600 inline-flex gap-2 items-center">
          <CheckCircle2 className="w-4 h-4" />
          Order successful
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Thanks for ordering
        </h1>
      </div>
      <div className="w-full text-left mb-4">
        <h3 className="text-2xl font-semibold mb-2">Order</h3>
        <Separator className="mb-2" />
        <ul className="mt-4 divide-y divide-gray-200">
          {invoice.lines.data.map((product) => {
            return (
              <Card key={product.id}>
                <CardHeader className="flex items-center flex-row justify-between gap-6 space-y-0">
                  <h3 className="inline-flex gap-2 items-center font-medium">
                    {product.plan?.nickname}{" "}
                    <Badge className="bg-emerald-600 text-white text-xs">
                      PAID
                    </Badge>
                  </h3>
                  <span className="flex-none font-medium">
                    {formatPrice(product.amount / 100)} / month
                  </span>
                </CardHeader>
                <CardContent className="flex items-start space-x-6">
                  <div className="flex-auto flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Start Date:{" "}
                        {format(
                          new Date(product.period.start * 1000),
                          "dd/MM/yyyy hh:mm a"
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        End Date:{" "}
                        {format(
                          new Date(product.period.end * 1000),
                          "dd/MM/yyyy hh:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ul>
        <div className="space-y-6 mt-4 border-t border-border pt-6 text-sm font-medium w-full">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>{formatPrice(invoice.subtotal / 100)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Transaction Fee</p>
            <p>{formatPrice(0)}</p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="text-base">Total</p>
            <p className="text-base">{formatPrice(invoice.subtotal / 100)}</p>
          </div>
        </div>
      </div>
      <div className="w-full text-left">
        <h3 className="text-2xl font-semibold mb-2">Shipping Information</h3>
        <Separator className="mb-2" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Country</Label>
            <p className="text-muted-foreground text-sm">
              {invoice.customer_shipping?.address?.country ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <p className="text-muted-foreground text-sm">
              {invoice.customer_shipping?.address?.city ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>Postal Code</Label>
            <p className="text-muted-foreground text-sm">
              {invoice.customer_shipping?.address?.postal_code ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>Agency Name</Label>
            <p className="text-muted-foreground text-sm">
              {invoice.customer_shipping?.name ?? "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 w-full mt-4">
        {invoice.invoice_pdf && (
          <Link
            href={invoice.invoice_pdf}
            className={cn(
              "inline-flex items-center gap-2",
              buttonVariants({ variant: "secondary" })
            )}
          >
            <Upload className="w-4 h-4" />
            Download PDF
          </Link>
        )}
        <Link
          href="/"
          className={cn("inline-flex items-center gap-2", buttonVariants())}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessfullPage;

export const metadata = constructMetadata({
  title: "Payment successfull - Plura",
});
