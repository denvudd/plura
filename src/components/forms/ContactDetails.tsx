"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveActivityLogsNotification } from "@/queries/notifications";
import { upsertContact } from "@/queries/contacts";

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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  type ContactDetailsSchema,
  ContactDetailsValidator,
} from "@/lib/validators/contact-details";

interface ContactDetailsProps {
  subAccountId: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ subAccountId }) => {
  const router = useRouter();
  const { setClose, data } = useModal();

  const form = useForm<ContactDetailsSchema>({
    mode: "onChange",
    resolver: zodResolver(ContactDetailsValidator),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form.reset]);

  const onSubmit: SubmitHandler<ContactDetailsSchema> = async (values) => {
    try {
      const response = await upsertContact({
        email: values.email,
        name: values.name,
        subAccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a contact | ${response?.name}`,
        subAccountId,
      });

      toast.success("Success", {
        description: "Saved contact details",
      });

      setClose();
      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not save contact details",
      });
    }
  };

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <Card className=" w-full">
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
        <CardDescription>
          You can assign tickets to contacts and set a value for each contact in
          the ticket.
        </CardDescription>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end">
              <Button disabled={isLoading} isLoading={isLoading} type="submit">
                Save Contact Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
