"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { Prisma, Tag } from "@prisma/client";

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      lane: {
        pipelineId,
      },
    },
    include: {
      tags: true,
      assigned: true,
      customer: true,
    },
  });

  return response;
};

export const getTicketDetails = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: {
      laneId,
    },
    include: {
      assigned: true,
      customer: true,
      lane: true,
      tags: true,
    },
  });

  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;

  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: {
        laneId: ticket.laneId,
      },
    });

    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id || uuidv4(),
    },
    update: {
      ...ticket,
      tags: {
        set: tags,
      },
    },
    create: {
      ...ticket,
      tags: {
        connect: tags,
      },
      order,
    },
    include: {
      assigned: true,
      customer: true,
      tags: true,
      lane: true,
    },
  });

  return response;
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};
