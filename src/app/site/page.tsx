import React from "react";

import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import HoverPriceCard from "@/components/modules/landing/HoverPriceCard";

import { HeroContainerScroll } from "@/components/modules/landing/HeroContainerScroll";
import { InfiniteMovingCards } from "@/components/modules/landing/InfiniteMovingCard";

const HomePage: React.FC = () => {
  return (
    <div className="h-full">
      <div className="absolute bottom-0 left-0 right-0 top-0 dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[linear-gradient(to_right,#c4c2c2_1px,transparent_1px),linear-gradient(to_bottom,#c4c2c2_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
      <section className="w-full relative">
        <MaxWidthWrapper className="pt-36">
          <HeroContainerScroll />
        </MaxWidthWrapper>
      </section>
      <section>
        <MaxWidthWrapper className="flex items-center flex-col gap-4 md:mt-20">
          <h2 className="text-4xl text-center">Choose what fits you right</h2>
          <p className="text-muted-foreground text-center">
            Our straightforward pricing plans are tailored to meet your needs.
            If you&apos;re not ready to commit you can get started for free.
          </p>
          <HoverPriceCard />
        </MaxWidthWrapper>
      </section>
      <section className="w-full md:mt-20 pb-20">
        <InfiniteMovingCards pauseOnHover={false} speed="slow" />
      </section>
    </div>
  );
};

export default HomePage;
