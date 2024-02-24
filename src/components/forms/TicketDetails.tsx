"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Contact, Tag, User } from "@prisma/client";

import { getSubAccountTeamMembers } from "@/queries/subaccount";
import { searchContacts } from "@/queries/contacts";
import { saveActivityLogsNotification } from "@/queries/notifications";
import { upsertTicket } from "@/queries/tickets";

import { useModal } from "@/hooks/use-modal";
import {
  TicketDetailsSchema,
  TicketDetailsValidator,
} from "@/lib/validators/ticket-details";
import type { TicketsWithTags } from "@/lib/types";
import { logger } from "@/lib/utils";

interface TicketDetailsProps {
  laneId: string;
  subAccountId: string;
  getNewTicket: (ticket: TicketsWithTags[0]) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  getNewTicket,
  laneId,
  subAccountId,
}) => {
  const router = useRouter();
  const { data: defaultData, setClose } = useModal();

  const [tags, setTags] = React.useState<Tag[]>([]);
  const [contactList, setContactList] = React.useState<Contact[]>([]);
  const [allTeamMembers, setAllTeamMembers] = React.useState<User[]>([]);
  const [contactId, setContactId] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [assignedTo, setAssignedTo] = React.useState<string>(
    defaultData?.ticket?.assigned?.id || ""
  );

  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const form = useForm<TicketDetailsSchema>({
    resolver: zodResolver(TicketDetailsValidator),
    mode: "onChange",
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });

  React.useEffect(() => {
    if (subAccountId) {
      const fetchTeamMembers = async () => {
        const response = await getSubAccountTeamMembers(subAccountId);

        if (response) setAllTeamMembers(response);
      };

      fetchTeamMembers();
    }
  }, [subAccountId]);

  React.useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket.description || "",
        value: String(defaultData.ticket.value || 0),
      });

      if (defaultData.ticket.customerId) {
        setContactId(defaultData.ticket.customerId);
      }

      const fetchContacts = async () => {
        const response = await searchContacts(
          defaultData.ticket?.customer?.name!
        );
        setContactList(response);
      };

      fetchContacts();
    }
  }, [defaultData]);

  const onSubmit: SubmitHandler<TicketDetailsSchema> = async (values) => {
    if (!laneId) return;

    try {
      const response = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
          ...(contactId
            ? {
                customerId: contactId,
              }
            : {}),
        },
        tags
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a ticket | ${response?.name}`,
        subAccountId,
      });

      toast.success("Success", {
        description: "Saved ticket details",
      });

      if (response) {
        getNewTicket(response);
        setClose();
      }

      router.refresh();
    } catch (error) {
      logger(error);
      toast.error("Oppse!", {
        description: "Could not save ticket details",
      });
    }
  };

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  return <div>TicketDetails</div>;
};

export default TicketDetails;
