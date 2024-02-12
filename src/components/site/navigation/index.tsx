import React from "react";
import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/global/ModeToggle";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { User } from "@clerk/nextjs/server";

import logoImage from "../../../../public/assets/plura-logo.svg";

interface NavigationProps {
  user?: User | null;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image src={logoImage} width={40} height={40} alt="Plura Logo" />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ul className="flex items-center gap-8">
          <li>
            <Link href="#">Pricing</Link>
          </li>
          <li>
            <Link href="#">About</Link>
          </li>
          <li>
            <Link href="#">Documentation</Link>
          </li>
          <li>
            <Link href="#">Features</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link href="/agency" className={cn(buttonVariants())}>
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
