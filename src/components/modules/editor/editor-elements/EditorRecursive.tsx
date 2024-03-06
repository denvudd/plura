import React from "react";

import EditorText from "./EditorText";
import EditorContainer from "./EditorContainer";
import EditorVideo from "./EditorVideo";
import EditorLink from "./EditorLink";
import EditorContact from "./EditorContact";
import EditorPayment from "./EditorPayment";

import type { EditorElement } from "@/lib/types/editor";

type Props = {
  element: EditorElement;
};

const EditorRecursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <EditorText element={element} />;
    case "container":
      return <EditorContainer element={element} />;
    case "__body":
      return <EditorContainer element={element} />;
    case "2Col":
      return <EditorContainer element={element} />;
    case "video":
      return <EditorVideo element={element} />;
    case "link":
      return <EditorLink element={element} />;
    case "contactForm":
      return <EditorContact element={element} />;
    case "paymentForm":
      return <EditorPayment element={element} />;
    default:
      return null;
  }
};

export default EditorRecursive;
