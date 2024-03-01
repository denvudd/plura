import React from "react";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";
import { format } from "date-fns";

import { getSubAccountWithContacts } from "@/queries/contacts";

import BlurPage from "@/components/common/BlurPage";
import { formatPrice } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CreateContactButton from "./_components/CreateButton";

interface SubAccountContactPageProps {
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountContactPage: React.FC<SubAccountContactPageProps> = async ({
  params,
}) => {
  const { subaccountId } = params;

  if (!subaccountId) redirect("/subaccount/unauthorized");

  const contacts = await getSubAccountWithContacts(subaccountId);
  const allContacts = contacts?.contacts;

  const formatTotal = (tickets: { value: Decimal | null }[]) => {
    if (!tickets || !tickets.length) return null;

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket.value) || 0),
      0,
    );

    return formatPrice(laneAmt);
  };

  return (
    <BlurPage>
      <div className="flex items-center justify-between md:flex-row flex-col gap-2">
        <h1 className="text-3xl mb-4 font-bold">Contacts</h1>
        <CreateContactButton subAccountId={subaccountId} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {!!allContacts?.length &&
            allContacts.map((contact) => {
              console.log(formatTotal(contact.tickets));

              return (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage alt={contact.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    {formatTotal(contact.tickets) === null ? (
                      <Badge variant="destructive">Inactive</Badge>
                    ) : (
                      <Badge className="bg-emerald-700">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(contact.createdAt, "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell>{formatTotal(contact.tickets)}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </BlurPage>
  );
};

export default SubAccountContactPage;
