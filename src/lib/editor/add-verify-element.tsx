import { v4 as uuidv4 } from "uuid";
import { defaultStyles } from "@/config/editor";
import { EditorAction, EditorBtns } from "../types/editor";

export const addVerifyElement = (
  componentType: EditorBtns,
  id: string,
  dispatch: (value: EditorAction) => void
) => {
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
