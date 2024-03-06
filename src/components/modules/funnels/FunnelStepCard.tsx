"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Draggable } from "react-beautiful-dnd";
import { ArrowDown, LayoutGrid } from "lucide-react";
import { type FunnelPage } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FunnelStepCardProps {
  funnelPage: FunnelPage;
  index: number;
  activePage: boolean;
  totalPages: number;
}

const FunnelStepCard: React.FC<FunnelStepCardProps> = ({
  activePage,
  funnelPage,
  index,
  totalPages,
}) => {
  let portal = document.getElementById("blur-page");

  return (
    <Draggable draggableId={funnelPage.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300 };
          // @ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          // @ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            left: x,
          };
        }

        const component = (
          <Card
            className={cn("p-0 relative cursor-grab my-2 rounded-sm", {
              "border-primary": activePage,
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent className="p-0 flex items-center gap-4 flex-row">
              <div className="h-14 w-14 bg-muted rounded-ss-sm rounded-es-sm flex items-center justify-center">
                <LayoutGrid />
                {funnelPage.order !== totalPages && (
                  <ArrowDown className="w-5 h-5 absolute -bottom-2 text-primary" />
                )}
              </div>
              {funnelPage.name}
            </CardContent>
            {funnelPage.order === 0 && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                Default
              </Badge>
            )}
          </Card>
        );

        if (!portal) return component;
        if (snapshot.isDragging) {
          return createPortal(component, portal);
        }

        return component;
      }}
    </Draggable>
  );
};

export default FunnelStepCard;
