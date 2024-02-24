"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";

import { deletePipeline, upsertPipeline } from "@/queries/pipelines";
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
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pipeline } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  CreatePipelineValidator,
  type CreatePipelineSchema,
} from "@/lib/validators/create-pipeline";

interface PipelineDetailsProps {
  defaultData?: Pipeline;
  subAccountId: string;
  pipelineId: string;
}

const PipelineDetails: React.FC<PipelineDetailsProps> = ({
  defaultData,
  subAccountId,
  pipelineId,
}) => {
  const { data, isOpen, setOpen, setClose } = useModal();
  const router = useRouter();
  const form = useForm<CreatePipelineSchema>({
    mode: "onChange",
    resolver: zodResolver(CreatePipelineValidator),
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

  const isLoading = form.formState.isLoading;

  const handleDelete = async () => {
    try {
      const response = await deletePipeline(pipelineId);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Delete pipeline | ${response?.name}`,
        subAccountId,
      });

      toast.success("Deleted", {
        description: "Pipeline is deleted",
      });
      router.push(`/subaccount/${subAccountId}/pipelines`);
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could Delete Pipeline",
      });
    }
  };

  const onSubmit: SubmitHandler<CreatePipelineSchema> = async (values) => {
    if (!subAccountId) return;

    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId: subAccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${response?.name}`,
        subAccountId,
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

  return (
    <Card className="max-w-xl w-full mx-auto">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2 mt-4">
              <Button
                className="w-20"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Save
              </Button>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Pipeline</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    thiss pipeline and all related records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="items-center">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PipelineDetails;
