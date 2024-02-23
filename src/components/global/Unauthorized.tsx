import React from "react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface UnauthorizedProps {}

const Unauthorized: React.FC<UnauthorizedProps> = ({}) => (
  <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
    <h1 className="text-3xl md:text-4xl font-medium">Unauthorized acccess!</h1>
    <p className="mt-2">
      Please contact support or your agency owner to get access
    </p>
    <Link href="/" className={cn("mt-4 inline-flex items-center gap-2", buttonVariants())}>
      <ArrowLeft className="w-4 h-4" />
      Back to home
    </Link>
  </div>
);

export default Unauthorized;
