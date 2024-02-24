"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Lane, type Ticket } from "@prisma/client";

import { useModal } from "@/hooks/use-modal";
import type {
  LaneDetails,
  PipelineDetailsWithLanesCardsTagsTickets,
} from "@/lib/types";

interface PipelineViewProps {
  lanes: LaneDetails[];
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

  const [allLanes, setAllLanes] = React.useState<LaneDetails[]>(lanes);

  React.useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  return <div>PipelineView</div>;
};

export default PipelineView;
