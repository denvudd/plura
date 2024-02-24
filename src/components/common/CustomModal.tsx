'use client';

import React from "react";

import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface CustomModalProps {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  scrollShadow?: boolean;
  defaultOpen?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
  defaultOpen,
  subTitle,
  title,
  scrollShadow = true,
}) => {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="bg-card max-w-xl">
        <ScrollArea scrollShadow={scrollShadow} className="md:max-h-[700px]">
          <div className="flex flex-col gap-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription>{subTitle}</DialogDescription>
            </DialogHeader>
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
