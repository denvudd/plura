'use client';

import React from "react";
import { ModalContext } from "@/components/providers/ModalProvider";

export const useModal = () => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModal hook must be used within the modal provider");
  }

  return context;
};
