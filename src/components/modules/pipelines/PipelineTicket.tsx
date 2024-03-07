import React from "react";
import { useRouter } from "next/navigation";
import { Draggable } from "react-beautiful-dnd";
import {
  Contact2,
  Edit,
  Link2,
  MoreHorizontal,
  Trash,
  User2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { deleteTicket } from "@/queries/tickets";
import { saveActivityLogsNotification } from "@/queries/notifications";

import { useModal } from "@/hooks/use-modal";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tag } from "@/components/ui/tag";
import CustomModal from "@/components/common/CustomModal";
import TicketDetails from "@/components/forms/TicketDetails";

import type { TicketsWithTags } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface PipelineTicketProps {
  setAllTickets: React.Dispatch<React.SetStateAction<TicketsWithTags>>;
  allTickets: TicketsWithTags;
  ticket: TicketsWithTags[0];
  subAccountId: string;
  index: number;
}

const PipelineTicket: React.FC<PipelineTicketProps> = ({
  allTickets,
  index,
  setAllTickets,
  subAccountId,
  ticket,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const editNewTicket = (ticket: TicketsWithTags[0]) => {
    setAllTickets(() => {
      return allTickets.map((t) => {
        if (t.id === ticket.id) {
          return ticket;
        }

        return t;
      });
    });
  };

  const handleClickEdit = async () => {
    setOpen(
      <CustomModal title="Update Ticket Details">
        <TicketDetails
          getNewTicket={editNewTicket}
          laneId={ticket.laneId}
          subAccountId={subAccountId}
        />
      </CustomModal>,
      async () => {
        // async just for typescript
        return { ticket: ticket };
      }
    );
  };

  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id));

      const response = await deleteTicket(ticket.id);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a ticket | ${response?.name}`,
        subAccountId,
      });

      toast.success("Deleted", {
        description: "Deleted ticket from lane.",
      });
      
      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not delete the ticket.",
      });
    }
  };

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 20 }
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          }
        }

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <AlertDialog>
              <DropdownMenu>
                <Card className="my-4 dark:bg-background bg-white shadow-none transition-all">
                  <CardHeader className="p-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg w-full">{ticket.name}</span>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="text-muted-foreground" />
                      </DropdownMenuTrigger>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(ticket.createdAt), "dd/MM/yyyy hh:mm")}
                    </span>
                    <div className="flex items-center flex-wrap gap-2">
                      {ticket.tags.map((tag) => (
                        <Tag
                          key={tag.id}
                          title={tag.name}
                          colorName={tag.color}
                        />
                      ))}
                    </div>
                    <CardDescription className="w-full">
                      {ticket.description}
                    </CardDescription>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="p-2 justify-center text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-md cursor-pointer items-center">
                          <Link2 />
                          <span className="text-xs font-bold">CONTACT</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage />
                            <AvatarFallback className="bg-primary">
                              {ticket.customer?.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {ticket.customer?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {ticket.customer?.email}
                            </p>
                            <div className="flex items-center pt-2">
                              <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                Joined{" "}
                                {ticket.customer?.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardHeader>

                  <CardFooter className="m-0 p-2 border-t border-muted-foreground/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage
                          alt="contact"
                          src={ticket.assigned?.avatarUrl}
                        />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          {ticket.assigned?.name}
                          {!ticket.assignedUserId && <User2 className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-xs justify-center">
                        <span className="text-muted-foreground">
                          {ticket.assignedUserId
                            ? "Assigned to:"
                            : "Not Assigned"}
                        </span>
                        {ticket.assignedUserId && (
                          <span className="text-xs w-28 overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                            {ticket.assigned?.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {!!ticket.value && (
                      <span className="text-sm font-bold">
                        {formatPrice(+ticket.value)}
                      </span>
                    )}
                  </CardFooter>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleClickEdit}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Ticket
                    </DropdownMenuItem>
                    <AlertDialogTrigger>
                      <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                        <Trash className="w-4 h-4" />
                        Delete Ticket
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </Card>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteTicket}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineTicket;
