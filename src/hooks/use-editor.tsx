import React from "react";
import { EditorContext } from "@/components/providers/EditorProvider";

export const useEditor = () => {
  const context = React.useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor hook must be used within the editor provider");
  }

  return context;
};
