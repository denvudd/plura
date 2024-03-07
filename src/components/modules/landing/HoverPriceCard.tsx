"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PRICING } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const HoverPriceCard: React.FC = ({}) => {
  let [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
      {PRICING.map((price, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-muted/[0.8] -z-[1] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            key={price.title}
            className={cn("w-[300px] flex flex-col justify-between z-30", {
              "border border-primary": price.title === "Unlimited Saas",
            })}
          >
            <CardHeader>
              <CardTitle>{price.title}</CardTitle>
              <CardDescription>{price.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{price.price}</span>
              {price.title !== "Starter" && (
                <span className="text-muted-foreground">/m</span>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex flex-col gap-2">
                {price.features.map((feature) => (
                  <div key={feature} className="flex gap-2 items-center">
                    <CheckCircle2
                      aria-hidden
                      className="text-emerald-500 h-5 w-5"
                    />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/agency?plan=${price.priceId}`}
                className={cn(
                  "w-full",
                  buttonVariants({
                    variant:
                      price.title !== "Unlimited Saas"
                        ? "secondary"
                        : "default",
                  })
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default HoverPriceCard;
