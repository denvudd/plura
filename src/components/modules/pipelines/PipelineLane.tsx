"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";

import { deleteLane } from "@/queries/lanes";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PipelineTicket from "./PipelineTicket";
import LaneDetails from "@/components/forms/LaneDetails";
import TicketDetails from "@/components/forms/TicketDetails";
import CustomModal from "@/components/common/CustomModal";

import { cn, formatPrice } from "@/lib/utils";
import type {
  LaneDetails as LaneDetailsType,
  TicketsWithTags,
} from "@/lib/types";
import { toast } from "sonner";

interface PipelaneLaneProps {
  setAllTickets: React.Dispatch<React.SetStateAction<TicketsWithTags>>;
  allTickets: TicketsWithTags;
  tickets: TicketsWithTags;
  pipelineId: string;
  laneDetails: LaneDetailsType;
  subAccountId: string;
  index: number;
}

const PipelineLane: React.FC<PipelaneLaneProps> = ({
  setAllTickets,
  tickets,
  pipelineId,
  laneDetails,
  subAccountId,
  allTickets,
  index,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const laneAmt = React.useMemo(() => {
    return tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );
  }, [tickets]);

  const addNewTicket = (ticket: TicketsWithTags[0]) => {
    setAllTickets([...allTickets, ticket]);
  };

  const handleCreateTicket = () => {
    setOpen(
      <CustomModal
        title="Create A Ticket"
        subTitle="Tickets are a great way to keep track of tasks"
      >
        <TicketDetails
          getNewTicket={addNewTicket}
          laneId={laneDetails.id}
          subAccountId={subAccountId}
        />
      </CustomModal>
    );
  };

  const handleEditLane = () => {
    setOpen(
      <CustomModal title="Edit Lane Details" scrollShadow={false}>
        <LaneDetails pipelineId={pipelineId} defaultData={laneDetails} />
      </CustomModal>
    );
  };

  const handleDeleteLane = async () => {
    try {
      const response = await deleteLane(laneDetails.id);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a lane | ${response?.name}`,
        subAccountId,
      });

      toast.success("Deleted", {
        description: "Deleted lane",
      });

      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not delete the lane",
      });
    }
  };

  return (
    <Draggable
      draggableId={laneDetails.id.toString()}
      index={index}
      key={laneDetails.id}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }

        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="h-full rounded-md"
          >
            <AlertDialog>
              <DropdownMenu>
                <div className="bg-slate-200/30 dark:bg-background/20 h-[700px] w-[300px] px-4 relative rounded-md overflow-visible flex-shrink-0">
                  <div
                    {...provided.dragHandleProps}
                    className=" h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-200/60 rounded-md absolute top-0 left-0 right-0 z-10"
                  >
                    <div className="h-full flex items-center p-4 pr-2 justify-between cursor-grab border-b-[1px]">
                      {/* {laneDetails.order} */}
                      <div className="flex items-center w-full gap-2">
                        <div
                          className={cn("w-4 h-4 rounded-full")}
                          style={{ background: laneDetails.color }}
                        />
                        <span className="font-bold text-sm">
                          {laneDetails.name}
                        </span>
                      </div>
                      <div className="flex items-center flex-row gap-1">
                        <Badge className="bg-white text-black">
                          {formatPrice(laneAmt)}
                        </Badge>
                        <DropdownMenuTrigger>
                          <MoreVertical className="text-muted-foreground cursor-pointer w-5 h-5" />
                        </DropdownMenuTrigger>
                      </div>
                    </div>
                  </div>

                  <Droppable
                    droppableId={laneDetails.id.toString()}
                    key={laneDetails.id}
                    type="ticket"
                    isDropDisabled={false}
                  >
                    {(provided) => (
                      <div
                        className="max-h-[700px] h-full w-full pt-12 overflow-auto scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium z-[99999]"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {tickets.map((ticket, index) => (
                          <PipelineTicket
                            allTickets={allTickets}
                            setAllTickets={setAllTickets}
                            subAccountId={subAccountId}
                            ticket={ticket}
                            key={ticket.id.toString()}
                            index={index}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2 w-full cursor-pointer"
                      onClick={handleEditLane}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 w-full cursor-pointer"
                      onClick={handleCreateTicket}
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                      Create Ticket
                    </DropdownMenuItem>
                    <AlertDialogTrigger className="w-full">
                      <DropdownMenuItem className="flex items-center gap-2 w-full cursor-pointer text-destructive">
                        <Trash className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteLane}
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

export default PipelineLane;
