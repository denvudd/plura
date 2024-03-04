"use client";

import React from "react";
import Image from "next/image";
import Stripe from "stripe";
import { useRouter } from "next/navigation";
import { type Funnel } from "@prisma/client";

import { saveActivityLogsNotification } from "@/queries/notifications";
import { updateFunnelProducts } from "@/queries/funnels";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface FunnelProductsTableProps {
  defaultData: Funnel;
  products: Stripe.Product[];
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  products,
  defaultData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [liveProducts, setLiveProducts] = React.useState<
    { productId: string; recurring: boolean }[] | []
  >(JSON.parse(defaultData.liveProducts || "[]"));

  const handleSaveProducts = async () => {
    setIsLoading(true);

    const response = await updateFunnelProducts(
      JSON.stringify(liveProducts),
      defaultData.id
    );

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subAccountId: defaultData.subAccountId,
    });

    toast.success("Success", {
      description: "Live products updated",
    });
    setIsLoading(false);
    router.refresh();
  };

  const handleAddProduct = async (product: Stripe.Product) => {
    const productIdExists = liveProducts.find(
      // @ts-ignore
      (prod) => prod.productId === product.default_price?.id
    );
    productIdExists
      ? setLiveProducts(
          liveProducts.filter(
            // @ts-ignore
            (prod) => prod.productId !== product.default_price?.id
          )
        )
      : setLiveProducts([
          ...liveProducts,
          {
            //@ts-ignore
            productId: product.default_price?.id as string,
            //@ts-ignore
            recurring: !!product.default_price.recurring,
          },
        ]);
  };

  return (
    <div className="w-full">
      <Table className="bg-card rounded-md w-full">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  defaultChecked={
                    !!liveProducts.find(
                      //@ts-ignore
                      (prod) => prod.productId === product.default_price.id
                    )
                  }
                  onCheckedChange={() => handleAddProduct(product)}
                  className="w-4 h-4"
                />
              </TableCell>
              <TableCell>
                <Image
                  alt="product Image"
                  height={60}
                  width={60}
                  className="rounded-md object-center object-cover"
                  src={product.images[0]}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? "Recurring" : "One Time"
                }
              </TableCell>
              <TableCell className="text-right">
                {
                  //@ts-ignore
                  formatPrice(product.default_price?.unit_amount / 100)
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        onClick={handleSaveProducts}
        className="mt-4"
      >
        Save Products
      </Button>
    </div>
  );
};

export default FunnelProductsTable;
