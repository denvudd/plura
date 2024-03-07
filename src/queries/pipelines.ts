"use server";

import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

export const getUserPipelines = async (subAccountId: string) => {
  const pipelines = await db.pipeline.findMany({
    where: {
      subAccountId,
    },
  });

  return pipelines;
};

export const getPipelines = async (subAccountId: string) => {
  const pipelines = await db.pipeline.findMany({
    where: {
      subAccountId,
    },
    include: {
      lanes: {
        include: {
          tickets: true,
        },
      },
    },
  });

  return pipelines;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });

  return response;
};

export const createPipeline = async (subAccountId: string) => {
  try {
    const response = await db.pipeline.create({
      data: {
        name: "First Pipeline",
        subAccountId,
      },
    });

    return response;
  } catch (error) {
    logger(error);
  }
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLanesInput
) => {
  const response = await db.pipeline.upsert({
    where: {
      id: pipeline.id || v4(),
    },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: {
      id: pipelineId,
    },
  });

  return response;
};
