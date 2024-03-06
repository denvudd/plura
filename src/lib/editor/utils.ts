import React from "react";
import { Editor, EditorAction } from "../types/editor";

export const formatTextOnKeyboard = (
  keyboardEvent: React.KeyboardEvent,
  editor: Editor,
  dispatch: (value: EditorAction) => void
): void => {
  if (
    keyboardEvent.key === "u" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...editor.selectedElement.styles,
            textDecoration:
              editor.selectedElement.styles.textDecoration === "underline"
                ? "none"
                : "underline",
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "i" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...editor.selectedElement.styles,
            fontStyle:
              editor.selectedElement.styles.fontStyle === "italic"
                ? "normal"
                : "italic",
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "b" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...editor.selectedElement.styles,
            fontWeight:
              editor.selectedElement.styles.fontWeight === "700"
                ? "normal"
                : "700",
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "e" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...editor.selectedElement.styles,
            textAlign:
              editor.selectedElement.styles.textAlign === "center"
                ? "left"
                : "center",
          },
        },
      },
    });
  }
};
