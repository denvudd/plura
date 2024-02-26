"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Flag, Plus } from "lucide-react";
import { type Lane, type Ticket } from "@prisma/client";

import { useModal } from "@/hooks/use-modal";
import type {
  LaneDetails as LaneDetailsType,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/common/CustomModal";
import LaneDetails from "@/components/forms/LaneDetails";
import PipelineLane from "./PipelineLane";

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
    (lane) => lane.tickets
  );

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create a Lane"
        subTitle="Lanes allow you to group tickets"
        scrollShadow={false}
      >
        <LaneDetails pipelineId={pipelineId}></LaneDetails>
      </CustomModal>
    );
  };

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-white/60 dark:bg-background/60 rounded-md p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{pipelineDetails?.name}</h1>
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
            <p className="text-xs font-medium">You don&apos;t have any lanes. Go create one!</p>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
