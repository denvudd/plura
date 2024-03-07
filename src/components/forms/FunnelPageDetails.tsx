"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BadgeInfo, CopyPlusIcon, Info, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { type FunnelPage } from "@prisma/client";

import { saveActivityLogsNotification } from "@/queries/notifications";
import {
  upsertFunnelPage,
  getFunnels,
  deleteFunnelPage,
} from "@/queries/funnels";

import { useModal } from "@/hooks/use-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  type FunnelPageDetailsSchema,
  FunnelPageDetailsValidator,
} from "@/lib/validators/funnel-page-details";


interface FunnelPageDetailsProps {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subAccountId: string;
}

const FunnelPageDetails: React.FC<FunnelPageDetailsProps> = ({
  funnelId,
  order,
  subAccountId,
  defaultData,
}) => {
  const router = useRouter();
  const { setClose } = useModal();

  const form = useForm<FunnelPageDetailsSchema>({
    resolver: zodResolver(FunnelPageDetailsValidator),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  React.useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const onSubmit: SubmitHandler<FunnelPageDetailsSchema> = async (values) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });

    try {
      const response = await upsertFunnelPage(subAccountId, funnelId, {
        ...values,
        id: defaultData?.id || uuidv4(),
        order: defaultData?.order || order,
        pathName: values.pathName || "",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId,
      });

      toast.success("Success", {
        description: "Saved funnel page details",
      });

      setClose();
      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not save funnel page details",
      });
    }
  };

  const handleDeleteFunnelPage = async () => {
    if (!defaultData?.id) return null;

    const response = await deleteFunnelPage(defaultData.id);

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a funnel page | ${response?.name}`,
      subAccountId,
    });

    toast.success("Success", {
      description: "Deleted funnel page",
    });

    router.refresh();
  };

  const handleCopyFunnelPage = async () => {
    const response = await getFunnels(subAccountId);

    const lastFunnelPage = response.find((funnel) => funnel.id === funnelId)
      ?.funnelPages.length;

    await upsertFunnelPage(subAccountId, funnelId, {
      ...defaultData,
      id: uuidv4(),
      order: lastFunnelPage ? lastFunnelPage : 0,
      visits: 0,
      name: `${defaultData?.name} Copy`,
      pathName: `${defaultData?.pathName}copy`,
      content: defaultData?.content,
    });

    toast.success("Success", {
      description: "Saved funnel page details",
    });

    router.refresh();
  };

  const isLoading = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Funnel Page</CardTitle>
          <CardDescription>
            Funnel pages are flow in the order they are created by default. You
            can move them around to change their order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                disabled={form.formState.isSubmitting}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled if it's the first page
                disabled={form.formState.isSubmitting || order === 0}
                control={form.control}
                name="pathName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="inline-flex items-center gap-2">
                      Path Name
                      {order === 0 && (
                        <Badge variant="secondary" className="inline-flex gap-2 items-center">
                          Default
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 cursor-default" />
                            </TooltipTrigger>
                            <TooltipContent>
                              This is default path name for this funnel
                            </TooltipContent>
                          </Tooltip>
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Path for the page"
                        {...field}
                        value={field.value?.toLowerCase()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full items-center gap-2">
                {defaultData?.id && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive"
                          disabled={isLoading}
                          type="button"
                          size="icon"
                          onClick={handleDeleteFunnelPage}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Funnel Page</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={form.formState.isSubmitting}
                          type="button"
                          onClick={handleCopyFunnelPage}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CopyPlusIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate Funnel Page</TooltipContent>
                    </Tooltip>
                  </>
                )}
                <Button
                  className="w-22 self-end"
                  disabled={form.formState.isSubmitting}
                  isLoading={isLoading}
                  type="submit"
                >
                  Save page
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default FunnelPageDetails;
