"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { type Media } from "@prisma/client";

import { deleteMedia } from "@/queries/media";
import { saveActivityLogsNotification } from "@/queries/notifications";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";

interface MediaCardProps {
  file: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ file }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setClose } = useModal();

  const handleDelete = async () => {
    setIsLoading(true);

    const response = await deleteMedia(file.id);

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a media file | ${response?.name}`,
      subAccountId: response.subAccountId,
    });

    toast.success("Deleted File", {
      description: "Successfully deleted the file",
    });
    
    setIsLoading(false);
    setClose();
    router.refresh();
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-md bg-background">
          <div className="relative w-full h-40 bg-muted rounded-ss-md rounded-se-md">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground text-xs">
              {format(new Date(file.createdAt), "dd.MM.yyyy hh:mm a")}
            </p>
            <p className="text-base">{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast.success("Copied To Clipboard");
              }}
            >
              <Copy aria-hidden className="w-4 h-4" /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 text-destructive">
                <Trash aria-hidden className="w-4 h-4" /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
