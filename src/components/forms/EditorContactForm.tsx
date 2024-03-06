import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ContactDetailsSchema,
  ContactDetailsValidator,
} from "@/lib/validators/contact-details";

interface EditorContactFormProps {
  title: string;
  subTitle: string;
  buttonText: string;
  styles: React.CSSProperties;
  apiCall: (values: ContactDetailsSchema) => any;
}

const EditorContactForm: React.FC<EditorContactFormProps> = ({
  apiCall,
  subTitle,
  buttonText,
  styles,
  title,
}) => {
  const form = useForm<ContactDetailsSchema>({
    mode: "onChange",
    resolver: zodResolver(ContactDetailsValidator),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  // WIP: Create tags for each leads that comes from the form

  return (
    <Card style={styles}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {subTitle && <CardDescription>{subTitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
            className="flex flex-col gap-4"
          >
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
            <Button
              className="mt-4"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditorContactForm;
