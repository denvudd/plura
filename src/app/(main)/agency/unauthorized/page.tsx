import React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link
        href="/"
        className={cn(
          "mt-4",
          buttonVariants({ variant: "link" })
        )}
      >
        Back to home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
