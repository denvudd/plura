"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  });

  return response;
};

export const getSubAccountWithContacts = async (subAccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subAccountId,
    },
    include: {
      contacts: {
        include: {
          tickets: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return response;
};

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id || uuidv4() },
    update: contact,
    create: contact,
  });

  return response;
};
