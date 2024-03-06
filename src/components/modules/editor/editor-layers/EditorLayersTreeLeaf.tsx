"use client";

import React from "react";
import {
  Contact2Icon,
  CreditCardIcon,
  ImageIcon,
  Link2Icon,
  LucideIcon,
  TypeIcon,
  YoutubeIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EditorBtns, EditorElement } from "@/lib/types/editor";

interface EditorLayersTreeLeafProps
  extends React.HTMLAttributes<HTMLDivElement> {
  item: EditorElement;
  isSelected?: boolean;
  type: EditorBtns;
}

const EditorLayersTreeLeaf: React.FC<EditorLayersTreeLeafProps> = ({
  className,
  item,
  isSelected,
  type,
  ...props
}) => {
  let Icon: LucideIcon | undefined = undefined;

  switch (type) {
    case "text":
      Icon = TypeIcon;
      break;
    case "video":
      Icon = YoutubeIcon;
      break;
    case "link":
      Icon = Link2Icon;
      break;
    case "image":
      Icon = ImageIcon;
      break;
    case "contactForm":
      Icon = Contact2Icon;
      break;
    case "paymentForm":
      Icon = CreditCardIcon;
      break;
  }

  return (
    <div
      className={cn(
        "flex items-center p-3 cursor-pointer border-l w-full",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className="w-5 h-5 mr-2 text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <span className="flex-grow text-sm truncate inline-flex items-center justify-between gap-2 w-full">
        {item.name}{" "}
        {isSelected && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        )}
      </span>
    </div>
  );
};

EditorLayersTreeLeaf.displayName = EditorLayersTreeLeaf.name;

export default EditorLayersTreeLeaf;
