import React from "react";

import EditorText from "./EditorText";
import EditorContainer from "./EditorContainer";

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
    // case "video":
    //   return <VideoComponent element={element} />;
    // case "contactForm":
    //   return <ContactFormComponent element={element} />;
    // case "paymentForm":
    //   return <Checkout element={element} />;
    // case "link":
    //   return <LinkComponent element={element} />;
    // default:
    //   return null;
  }
};

export default EditorRecursive;
