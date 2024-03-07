"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Flag, Plus } from "lucide-react";
import { type Lane, type Ticket } from "@prisma/client";

import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/common/CustomModal";
import LaneDetails from "@/components/forms/LaneDetails";
import PipelineLane from "./PipelineLane";

import type {
  LaneDetails as LaneDetailsType,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from "@/lib/types";

interface PipelineViewProps {
  lanes: LaneDetailsType[];
  pipelineId: string;
  subAccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
}

const PipelineView: React.FC<PipelineViewProps> = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subAccountId,
  updateLanesOrder,
  updateTicketsOrder,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const [allLanes, setAllLanes] = React.useState<LaneDetailsType[]>(lanes);
  const [allTickets, setAllTickets] = React.useState<TicketAndTags[]>([]);

  React.useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsFromAllLanes: TicketAndTags[] = lanes.flatMap(
    (lane) => lane.tickets,
  );

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create a Lane"
        subTitle="Lanes allow you to group tickets"
        scrollShadow={false}
      >
        <LaneDetails pipelineId={pipelineId}></LaneDetails>
      </CustomModal>,
    );
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;

    // checks if the destination is invalid or if the element was dropped back to its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return null;
    }

    switch (type) {
      case "lane": {
        // update lane position during drag & drop
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1) // remove from origin position
          .toSpliced(destination.index, 0, allLanes[source.index]) // insert to new position
          .map((lane, index) => ({
            ...lane,
            order: index,
          }));

        setAllLanes(newLanes);
        updateLanesOrder(newLanes);

        router.refresh();
      }
      case "ticket": {
        const lanesCopyArray = [...allLanes];

        const originLane = lanesCopyArray.find(
          (lane) => lane.id === source.droppableId,
        );
        const destinationLane = lanesCopyArray.find(
          (lane) => lane.id === destination.droppableId,
        );

        if (!originLane || !destinationLane) return null;

        if (source.droppableId === destination.droppableId) {
          // update ticket position during drag & drop
          const newTickets = [...originLane.tickets]
            .toSpliced(source.index, 1) // remove from origin position
            .toSpliced(destination.index, 0, originLane.tickets[source.index]) // insert to new position
            .map((ticket, index) => ({
              ...ticket,
              order: index,
            }));

          originLane.tickets = newTickets; // updates the tickets in the origin lane loccaly
          setAllLanes(lanesCopyArray);
          updateTicketsOrder(newTickets);

          router.refresh();
        } else {
          const [currentTicket] = originLane.tickets.splice(source.index, 1);

          // rearrange original tickets
          originLane.tickets.forEach((ticket, index) => {
            ticket.order = index;
          });

          destinationLane.tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          });

          // rearrange destination tickets
          destinationLane.tickets.forEach((ticket, index) => {
            ticket.order = index;
          });

          setAllLanes(lanesCopyArray);
          updateTicketsOrder([
            ...destinationLane.tickets,
            ...originLane.tickets,
          ]);

          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-md p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{pipelineDetails?.name}</h1>
          <Button
            className="inline-flex items-center gap-2"
            onClick={handleAddLane}
          >
            <Plus className="w-4 h-4" /> Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
          isDropDisabled={false}
        >
          {(provided) => (
            <div
              className="flex items-center gap-x-2 overflow-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex items-start gap-3 mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    key={lane.id}
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subAccountId={subAccountId}
                    pipelineId={pipelineId}
                    tickets={lane.tickets}
                    laneDetails={lane}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {!allLanes.length && (
          <div className="flex items-center justify-center w-full flex-col gap-2 text-muted-foreground pb-10">
            <Flag className="w-32 h-32 opacity-100" />
            <p className="text-xs font-medium">
              You don&apos;t have any lanes. Go create one!
            </p>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
