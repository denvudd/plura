"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lane } from "@prisma/client";

import { getPipelineDetails } from "@/queries/pipelines";
import { upsertLane } from "@/queries/lanes";
import { saveActivityLogsNotification } from "@/queries/notifications";

import { useModal } from "@/hooks/use-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  type LaneDetailsSchema,
  LaneDetailsValidator,
} from "@/lib/validators/lane-details";

interface LaneDetailsProps {
  defaultData?: Lane;
  pipelineId: string;
}

const LaneDetails: React.FC<LaneDetailsProps> = ({
  defaultData,
  pipelineId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<LaneDetailsSchema>({
    mode: "onChange",
    resolver: zodResolver(LaneDetailsValidator),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  React.useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const onSubmit: SubmitHandler<LaneDetailsSchema> = async (values) => {
    if (!pipelineId) return;

    try {
      const response = await upsertLane({
        ...values,
        id: defaultData?.id,
        pipelineId: pipelineId,
        order: defaultData?.order,
      });

      const pipelineDetails = await getPipelineDetails(pipelineId);
      if (!pipelineDetails) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subAccountId: pipelineDetails.subAccountId,
      });

      toast.success("Success", {
        description: "Saved pipeline details",
      });

      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not save pipeline details",
      });
    }

    setClose();
  };

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lane Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button disabled={isLoading} isLoading={isLoading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneDetails;
