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

import {
  ELEMENT_LAYOUT_PLACEHOLDERS,
  ELEMENT_PRIMITIVE_PLACEHOLDERS,
} from "@/lib/editor/element-placeholders";

interface ComponentsTabProps {}

const ComponentsTab: React.FC<ComponentsTabProps> = ({}) => {
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
            {ELEMENT_LAYOUT_PLACEHOLDERS.map((element) => (
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
            {ELEMENT_PRIMITIVE_PLACEHOLDERS.map((element) => (
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
