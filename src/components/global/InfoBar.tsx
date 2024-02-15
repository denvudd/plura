"use client";

import React from "react";
import { Role } from "@prisma/client";

import { cn } from "@/lib/utils";
import { type NotificationsWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { format } from "date-fns";

interface InfoBarProps {
  notifications: NotificationsWithUser;
  subAccountId: string;
  role?: Role;
  className?: string;
}

const InfoBar: React.FC<InfoBarProps> = ({
  notifications,
  subAccountId,
  className,
  role,
}) => {
  const [allNotifications, setAllNotifications] =
    React.useState<NotificationsWithUser>(notifications);
  const [isShowAll, setIsShowAll] = React.useState<boolean>(true);

  const handleSwitch = () => {
    if (!isShowAll) {
      setAllNotifications(notifications);
    } else {
      if (!!notifications?.length) {
        const filteredNotifications = notifications?.filter(
          (notif) => notif.subAccountId === subAccountId
        );

        setAllNotifications(filteredNotifications ?? []);
      }
    }

    setIsShowAll((prev) => !prev);
  };

  return (
    <>
      <div
        className={cn(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px] ",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full w-8 h-8">
                <Bell aria-label="Notifications" className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="pr-4 flex flex-col" showClose>
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  {(role === Role.AGENCY_ADMIN ||
                    role === Role.AGENCY_OWNER) && (
                    <Card className="flex items-center justify-between p-4">
                      Current Subaccount
                      <Switch onChangeCapture={handleSwitch} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>
              {allNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-y-2 mb-2 overflow-x-scroll text-ellipsis"
                >
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={notification.user.avatarUrl}
                        alt="Profile Picture"
                      />
                      <AvatarFallback className="bg-primary">
                        {notification.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">
                          {notification.notification.split("|")[0]}
                        </span>
                        <span className="font-bold">
                          {notification.notification.split("|")[1]}
                        </span>
                        <span className="font-bold">
                          {notification.notification.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-sm text-muted-foreground">
                        {format(new Date(notification.createdAt), "dd/MM/yyyy")}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {!allNotifications?.length && (
                <div className="flex items-center justify-center mb-4 text-sm text-muted-foreground">
                  You have no notifications.
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
