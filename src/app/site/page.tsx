import React from "react";
import Image from "next/image";
import Link from "next/link";

import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICING } from "@/config/pricing";

import previewImage from "../../../public/assets/preview.png";

const HomePage: React.FC = () => {
  return (
    <div className="h-full">
      <section className="w-full relative">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        <MaxWidthWrapper className="pt-20">
          <p className="text-center font-medium">
            Run your agency, in just one place
          </p>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-9xl font-bold text-center md:text-[300px]">
              Plura
            </h1>
          </div>
          <div className="flex justify-center items-center relative md:mt-[-70px]">
            <Image
              src={previewImage}
              alt="Banner preview"
              width={1200}
              height={1200}
              className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
            />
            <div className="absolute inset-0 bg-gradient-to-t dark:from-background z-10"></div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section>
        <MaxWidthWrapper className="flex items-center flex-col gap-4 md:mt-20">
          <h2 className="text-4xl text-center">Choose what fits you right</h2>
          <p className="text-muted-foreground text-center">
            Our straightforward pricing plans are tailored to meet your needs.
            If you&apos;re not ready to commit you can get started for free.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap mt-6">
            {/* TODO: Wire up free product from stripe */}
            {PRICING.map((price) => (
              <Card
                key={price.title}
                className={cn("w-[300px] flex flex-col justify-between", {
                  "border border-primary": price.title === "Unlimited Saas",
                })}
              >
                <CardHeader>
                  <CardTitle
                    className={cn({
                      "text-muted-foreground": price.title === "Unlimited Saas",
                    })}
                  >
                    {price.title}
                  </CardTitle>
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
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
};

export default HomePage;
