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

import type { EditorBtns } from "@/lib/types/editor";

interface ComponentsTabProps {}

type ComponentElement = {
  component: React.ReactNode;
  label: string;
  id: EditorBtns;
  group: "layout" | "elements";
};

const ComponentsTab: React.FC<ComponentsTabProps> = ({}) => {
  const elements: ComponentElement[] = [
    {
      component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
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
                  {element.component}
                  <span className="mt-1">{element.label}</span>
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
                  {element.component}
                  <span className="mt-1">{element.label}</span>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ComponentsTab;
