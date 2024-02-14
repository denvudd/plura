"use client";

import React from "react";
import Image from "next/image";

import {
  type User,
  type AgencySidebarOption,
  type SubAccount,
  type SubAccountSidebarOption,
  type Agency,
  Role,
  Permissions,
} from "@prisma/client";
import { ChevronsUpDown, Compass, Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { AspectRatio } from "../ui/aspect-ratio";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";

interface MenuOptionsProps {
  id: string;
  defaultOpen?: boolean;
  subAccount: SubAccount[];
  sideBarOptions: AgencySidebarOption[] | SubAccountSidebarOption[];
  sideBarLogo: string;
  details: Agency | SubAccount;
  user: {
    agency: Agency | null;
    permissions: Permissions[];
  } & User;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
  details,
  id,
  sideBarLogo,
  sideBarOptions,
  subAccount,
  user,
  defaultOpen,
}) => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet
      modal={false}
      // open={defaultOpen ? true : false}
      open
    >
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:hidden flex"
      >
        <Button size="icon" variant="outline">
          <Menu aria-label="Open Menu" />
        </Button>
      </SheetTrigger>
      <SheetContent
        showClose={!defaultOpen}
        side="left"
        className={cn(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="">
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sideBarLogo}
              alt="Sidebar logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="w-full my-4 flex items-center justify-between py-8"
                variant="ghost"
              >
                <div className="flex items-center text-left gap-2">
                  <Compass aria-hidden />
                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">
                      {details.address}
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="h-80 mt-4 z-[200]">
              <Command>
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16">
                  <CommandEmpty>No results found.</CommandEmpty>
                  {(user.role === Role.AGENCY_OWNER ||
                    user.role === Role.AGENCY_ADMIN) &&
                    user.agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="bg-transparent my-2 text-primary border border-border p-2 rounded-md hover:bg-muted transition-all">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user.agency.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-10">
                                <Image
                                  src={user.agency.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {user.agency.name}
                                <span className="text-muted-foreground">
                                  {user.agency.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user.agency.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user.agency.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user.agency.name}
                                  <span className="text-muted-foreground">
                                    {user.agency.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandGroup heading="Accounts">
                    {!!subAccount.length ? (
                      subAccount.map((sub) => (
                        <CommandItem key={sub.id}>
                          {defaultOpen ? (
                            <Link
                              href={`/subaccount/${sub.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={sub.subAccountLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {sub.name}
                                <span className="text-muted-foreground">
                                  {sub.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/subaccount/${sub.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={sub.subAccountLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {sub.name}
                                  <span className="text-muted-foreground">
                                    {sub.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-xs text-center w-full">
                        No accounts found.
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        214141
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
