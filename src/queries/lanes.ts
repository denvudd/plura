"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { type Ticket, type Lane, Prisma } from "@prisma/client";
import { type LaneDetails } from "@/lib/types";
import { logger } from "@/lib/utils";

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

export const deleteLane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: {
      id: laneId,
    },
  });

  return response;
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });

    order = lanes.length; // set last order by default
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: {
      id: lane.id || uuidv4(),
    },
    update: lane,
    create: {
      ...lane,
      order,
    },
  });

  return response;
};
