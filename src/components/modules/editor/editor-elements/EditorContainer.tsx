import React from "react";
import { Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useEditor } from "@/hooks/use-editor";
import { Badge } from "@/components/ui/badge";
import EditorRecursive from "./EditorRecursive";

import { defaultStyles } from "@/config/editor";
import { cn } from "@/lib/utils";
import type { EditorBtns, EditorElement } from "@/lib/types/editor";

interface EditorContainerProps {
  element: EditorElement;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ element }) => {
  const { content, id, name, styles, type } = element;
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;

  const handleOnDrop = (event: React.DragEvent) => {
    event.stopPropagation();
    const componentType = event.dataTransfer.getData(
      "componentType"
    ) as EditorBtns;

    switch (componentType) {
      case "text": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Text Element",
              },
              id: uuidv4(),
              name: "Text",
              type: "text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
            },
          },
        });

        break;
      }
      case "image": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
                alt: "Image description",
              },
              id: uuidv4(),
              name: "Image",
              type: "image",
              styles: {
                color: "black",
                width: "1000px",
                height: "600px",
                aspectRatio: "1/1",
                marginLeft: "auto",
                marginRight: "auto",
                ...defaultStyles,
              },
            },
          },
        });

        break;
      }
      case "section": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: uuidv4(),
              name: "Section",
              type: "section",
              styles: {
                ...defaultStyles,
              },
            },
          },
        });

        break;
      }
      case "container": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Container",
              type: "container",
              styles: {
                ...defaultStyles,
              },
            },
          },
        });

        break;
      }
      case "link": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: uuidv4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          },
        });

        break;
      }
      case "video": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.youtube.com/embed/so1_VXaGqmM?si=2lBxVOuA57XMv0JX",
              },
              id: uuidv4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });

        break;
      }
      case "contactForm": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                formTitle: "Want a free quote? We can help you",
                formDescription: "Get in touch",
                formButton: "Submit",
              },
              id: uuidv4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });

        break;
      }
      case "paymentForm": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Payment",
              styles: {},
              type: "paymentForm",
            },
          },
        });

        break;
      }
      case "2Col": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: uuidv4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });

        break;
      }
      case "3Col": {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: uuidv4(),
              name: "Three Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "3Col",
            },
          },
        });

        break;
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // const handleDragStart = (event: React.DragEvent, type: EditorBtns) => {
  //   if (type === "__body") return undefined;

  //   event.dataTransfer.setData("componentType", type as string);
  // };

  const handleOnClickBody = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = (event: React.MouseEvent) => {
    event.stopPropagation();

    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={styles}
      className={cn(
        "relative p-4 transition-all group scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium",
        {
          "max-w-full w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full w-full overflow-y-auto overflow-x-hidden": type === "__body",
          "flex flex-col md:!flex-row": type === "2Col",
          "!border-blue-500":
            editor.selectedElement.id === id &&
            !editor.liveMode &&
            editor.selectedElement.type !== "__body",
          "!border-yellow-400 border-4":
            editor.selectedElement.id === id &&
            !editor.liveMode &&
            editor.selectedElement.type === "__body",
          "!mb-[200px]":
            !editor.liveMode && !editor.previewMode && type === "__body",
          "!border-solid": editor.selectedElement.id === id && !editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !editor.liveMode,
        }
      )}
      // onDragStart={(event) => handleDragStart(event, "container")}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      onClick={handleOnClickBody}
      // draggable={type !== "__body"}
    >
      <Badge
        className={cn(
          "absolute -top-6 -left-0.5 rounded-none rounded-t-md hidden",
          {
            block: editor.selectedElement.id === element.id && !editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((child) => (
          <EditorRecursive key={child.id} element={child} />
        ))}

      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer w-4 h-4"
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default EditorContainer;
