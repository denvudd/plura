import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ContainerPlaceholder from "./placeholders/ContainerPlaceholder";
import TextPlaceholder from "./placeholders/TextPlaceholder";
import VideoPlaceholder from "./placeholders/VideoPlaceholder";
import LinkPlaceholder from "./placeholders/LinkPlaceholder";
import TwoColumnsPlaceholder from "./placeholders/TwoColumnsPlaceholder";
import ContactFormPlaceholder from "./placeholders/ContactFormPlaceholder";
import PaymentFormPlaceholder from "./placeholders/PaymentFormPlaceholder";
import ImagePlaceholder from "./placeholders/ImagePlaceholder";
import ThreeColumnsPlaceholder from "./placeholders/ThreeColumnsPlaceholder";

import type { EditorBtns } from "@/lib/types/editor";
import SectionPlaceholder from "./placeholders/SectionPlaceholder";

interface ComponentsTabProps {}

type ComponentElement = {
  placeholder: React.ReactNode;
  label: string;
  id: EditorBtns;
  group: "layout" | "elements";
};

const ComponentsTab: React.FC<ComponentsTabProps> = ({}) => {
  const elements: ComponentElement[] = [
    {
      placeholder: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      placeholder: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      placeholder: <ImagePlaceholder />,
      label: "Image",
      id: "image",
      group: "elements",
    },
    {
      placeholder: <VideoPlaceholder />,
      label: "Video",
      id: "video",
      group: "elements",
    },
    {
      placeholder: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "elements",
    },
    {
      placeholder: <TwoColumnsPlaceholder />,
      label: "2 Columns",
      id: "2Col",
      group: "layout",
    },
    {
      placeholder: <ThreeColumnsPlaceholder />,
      label: "3 Columns",
      id: "3Col",
      group: "layout",
    },
    {
      placeholder: <SectionPlaceholder />,
      label: "Section",
      id: "section",
      group: "layout",
    },
    {
      placeholder: <ContactFormPlaceholder />,
      label: "Contact",
      id: "contactForm",
      group: "elements",
    },
    {
      placeholder: <PaymentFormPlaceholder />,
      label: "Payment",
      id: "paymentForm",
      group: "elements",
    },
  ];

  return (
    <>
      <SheetHeader className="text-left p-6">
        <SheetTitle>Components</SheetTitle>
        <SheetDescription>
          Build what you want! You can drag and drop components on the canvas.
        </SheetDescription>
      </SheetHeader>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["Layout", "Elements"]}
      >
        <AccordionItem value="Layout" className="px-6 py-0 border-y">
          <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2">
            {elements
              .filter((element) => element.group === "layout")
              .map((element) => (
                <div
                  key={element.id}
                  className="flex flex-col items-center justify-center"
                >
                  {element.placeholder}
                  <span className="mt-1 text-xs">{element.label}</span>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Elements" className="px-6 py-0">
          <AccordionTrigger className="!no-underline">
            Elements
          </AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 ">
            {elements
              .filter((element) => element.group === "elements")
              .map((element) => (
                <div
                  key={element.id}
                  className="flex-col items-center justify-center flex"
                >
                  {element.placeholder}
                  <span className="mt-1 text-xs">{element.label}</span>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ComponentsTab;
