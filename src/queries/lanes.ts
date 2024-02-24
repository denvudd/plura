"use server";

import { db } from "@/lib/db";
import { LaneDetails } from "@/lib/types";
import { logger } from "@/lib/utils";
import { Ticket, type Lane } from "@prisma/client";

export const getLanesWithTicketsAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      tickets: {
        orderBy: {
          order: "asc",
        },
        include: {
          tags: true,
          customer: true,
          assigned: true,
        },
      },
    },
  });

  return response as LaneDetails[];
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateLanes = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    );

    await db.$transaction(updateLanes);
  } catch (error) {
    logger(error);
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTickets = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    );

    await db.$transaction(updateTickets);
  } catch (error) {
    logger(error);
  }
};
