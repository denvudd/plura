"use client";

import React from "react";
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Expand,
  GripHorizontal,
  Italic,
  LucideImageDown,
  MousePointerClick,
  RemoveFormatting,
  Shrink,
  Type,
  Underline,
  Waves,
} from "lucide-react";

import { useEditor } from "@/hooks/use-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SettingsTabProps {}

const SettingsTab: React.FC<SettingsTabProps> = ({}) => {
  const { editor, dispatch } = useEditor();

  const handleChangeCustomValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const settingProperty = e.target.id;
    let value = e.target.value;

    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.editor.selectedElement,
          content: {
            ...editor.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.editor.selectedElement,
          styles: {
            ...editor.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  if (!editor.editor.selectedElement.id) {
    return (
      <>
        <SheetHeader className="text-left p-6">
          <SheetTitle>Styles</SheetTitle>
          <SheetDescription>
            Show your creativity! You can customize every component as you like.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 my-28 flex justify-center items-center">
          <div className="flex max-w-[200px] w-full mx-auto flex-col items-center text-sm gap-2 text-muted-foreground text-center">
            <MousePointerClick className="w-6 h-6" />
            Pick the component you want to customize
          </div>
        </div>
      </>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <SheetHeader className="text-left p-6">
        <SheetTitle>Styles</SheetTitle>
        <SheetDescription>
          Show your creativity! You can customize every component as you like.
        </SheetDescription>
      </SheetHeader>

      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "Custom",
          "Typography",
          "Dimensions",
          "Decorations",
          "Layout",
        ]}
      >
        {(editor.editor.selectedElement.type === "link" ||
          editor.editor.selectedElement.type === "video" ||
          editor.editor.selectedElement.type === "contactForm" ||
          editor.editor.selectedElement.type === "image") &&
          !Array.isArray(editor.editor.selectedElement.content) && (
            <AccordionItem value="Custom" className="px-6 py-0">
              <AccordionTrigger className="!no-underline">
                Custom
              </AccordionTrigger>
              <AccordionContent>
                {editor.editor.selectedElement.type === "link" && (
                  <div className="flex flex-col gap-2">
                    <Label>Link Path</Label>
                    <Input
                      id="href"
                      placeholder="https://domain.example.com/pathname"
                      onChange={handleChangeCustomValues}
                      value={editor.editor.selectedElement.content.href}
                    />
                  </div>
                )}
                {editor.editor.selectedElement.type === "video" && (
                  <div className="flex flex-col gap-2">
                    <Label>Video Path</Label>
                    <Input
                      id="src"
                      placeholder="https://domain.example.com/pathname"
                      onChange={handleChangeCustomValues}
                      value={editor.editor.selectedElement.content.src}
                    />
                  </div>
                )}
                {editor.editor.selectedElement.type === "contactForm" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Form title</Label>
                      <Input
                        id="formTitle"
                        placeholder="Want a free quote? We can help you"
                        onChange={handleChangeCustomValues}
                        value={editor.editor.selectedElement.content.formTitle}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Form description</Label>
                      <Input
                        id="formDescription"
                        placeholder="Get in touch with our team"
                        onChange={handleChangeCustomValues}
                        value={
                          editor.editor.selectedElement.content.formDescription
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Form button</Label>
                      <Input
                        id="formButton"
                        placeholder="Submit"
                        onChange={handleChangeCustomValues}
                        value={editor.editor.selectedElement.content.formButton}
                      />
                    </div>
                  </div>
                )}
                {editor.editor.selectedElement.type === "image" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Image Path</Label>
                      <Input
                        id="src"
                        placeholder="https://domain.example.com/pathname"
                        onChange={handleChangeCustomValues}
                        value={editor.editor.selectedElement.content.src}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Image alt description</Label>
                      <Input
                        id="alt"
                        placeholder="Image description"
                        onChange={handleChangeCustomValues}
                        value={
                          editor.editor.selectedElement.content.alt
                        }
                      />
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

        <AccordionItem value="Typography" className="px-6 py-0 border-y-[1px]">
          <AccordionTrigger className="!no-underline">
            Typography
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Text Align</Label>
              <ToggleGroup
                type="single"
                className="w-[274px] justify-between border rounded-md gap-4 items-center p-1"
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "textAlign",
                      value: e,
                    },
                  })
                }
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="left">
                      <AlignLeft className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Left</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="center">
                      <AlignCenter className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Center</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="right">
                      <AlignRight className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Right</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <ColorPicker
                value={editor.editor.selectedElement.styles.color}
                className="w-[274px]"
                onChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "color",
                      value: e,
                    },
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Text Decoration</Label>
              <ToggleGroup
                type="single"
                className="w-[274px] justify-between border rounded-md gap-4 items-center p-1"
                value={
                  editor.editor.selectedElement.styles.textDecoration as string
                }
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "textDecoration",
                      value: e,
                    },
                  })
                }
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="underline">
                      <Underline className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="inline-flex items-center gap-2">
                      Underline{" "}
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
                        <div className="text-xs">⌘</div>U
                      </kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="underline dotted">
                      <GripHorizontal className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Dotted</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="underline wavy">
                      <Waves className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Wavy</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Font Style</Label>
              <ToggleGroup
                type="single"
                className="justify-between border rounded-md gap-4 items-center p-1"
                value={editor.editor.selectedElement.styles.fontStyle as string}
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "fontStyle",
                      value: e,
                    },
                  })
                }
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="italic">
                      <Italic className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="inline-flex items-center gap-2">
                      Italic{" "}
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
                        <div className="text-xs">⌘</div>I
                      </kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="normal">
                      <Type className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Normal</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="oblique">
                      <RemoveFormatting className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Oblique</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "fontWeight",
                      value: e,
                    },
                  })
                }
                value={editor.editor.selectedElement.styles.fontWeight?.toString()}
                defaultValue={editor.editor.selectedElement.styles.fontWeight?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem value="700">Bold</SelectItem>
                    <SelectItem value="600">Semi-bold</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="normal">Regular</SelectItem>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="200">Extra-light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Size</Label>
              <Input
                placeholder="px"
                id="fontSize"
                onChange={handleOnChanges}
                defaultValue="16px"
                value={editor.editor.selectedElement.styles.fontSize}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Line Height</Label>
              <Input
                placeholder="rem"
                id="lineHeight"
                onChange={handleOnChanges}
                defaultValue="1.5rem"
                value={editor.editor.selectedElement.styles.lineHeight}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Decorations" className="px-6 py-0 ">
          <AccordionTrigger className="!no-underline">
            Decorations
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Opacity</Label>
              <div className="flex items-center justify-end -mt-2">
                <span className="p-2">
                  {typeof editor.editor.selectedElement.styles?.opacity ===
                  "number"
                    ? editor.editor.selectedElement.styles?.opacity
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.opacity || "100"
                        ).replace("%", "")
                      ) || 100}
                  %
                </span>
              </div>
              <Slider
                onValueChange={(e) => {
                  handleOnChanges({
                    target: {
                      id: "opacity",
                      value: `${e[0]}%`,
                    },
                  });
                }}
                className="-mt-2"
                defaultValue={[
                  typeof editor.editor.selectedElement.styles?.opacity ===
                  "number"
                    ? editor.editor.selectedElement.styles?.opacity
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.opacity || "100"
                        ).replace("%", "")
                      ) || 100,
                ]}
                max={100}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Border Color</Label>
              <ColorPicker
                value={
                  editor.editor.selectedElement.styles.borderColor as string
                }
                className="w-[274px]"
                onChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "borderColor",
                      value: e,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Border Width</Label>
              <div className="flex items-center justify-end -mt-2">
                <span className="p-2">
                  {typeof editor.editor.selectedElement.styles?.borderWidth ===
                  "number"
                    ? editor.editor.selectedElement.styles?.borderWidth
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.borderWidth ||
                          "0"
                        ).replace("px", "")
                      ) || 0}
                  px
                </span>
              </div>
              <Slider
                onValueChange={(e) => {
                  handleOnChanges({
                    target: {
                      id: "borderWidth",
                      value: `${e[0]}px`,
                    },
                  });
                }}
                className="-mt-2"
                defaultValue={[
                  typeof editor.editor.selectedElement.styles?.borderWidth ===
                  "number"
                    ? editor.editor.selectedElement.styles?.borderWidth
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.borderWidth ||
                          "0"
                        ).replace("%", "")
                      ) || 0,
                ]}
                max={100}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Border Radius</Label>
              <div className="flex items-center justify-end -mt-2">
                <span className="p-2">
                  {typeof editor.editor.selectedElement.styles?.borderRadius ===
                  "number"
                    ? editor.editor.selectedElement.styles?.borderRadius
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.borderRadius ||
                          "0"
                        ).replace("px", "")
                      ) || 0}
                  px
                </span>
              </div>
              <Slider
                onValueChange={(e) => {
                  handleOnChanges({
                    target: {
                      id: "borderRadius",
                      value: `${e[0]}px`,
                    },
                  });
                }}
                className="-mt-2"
                defaultValue={[
                  typeof editor.editor.selectedElement.styles?.borderRadius ===
                  "number"
                    ? editor.editor.selectedElement.styles?.borderRadius
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.borderRadius ||
                          "0"
                        ).replace("%", "")
                      ) || 0,
                ]}
                max={100}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Background Color</Label>
              <ColorPicker
                value={
                  editor.editor.selectedElement.styles.background as string
                }
                className="w-[274px]"
                onChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "background",
                      value: e,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Background Image</Label>
              <div className="flex  border-[1px] rounded-md overflow-clip">
                <div
                  className="w-12 object-cover object-center"
                  style={{
                    backgroundImage:
                      editor.editor.selectedElement.styles.backgroundImage,
                  }}
                />
                <Input
                  placeholder="url(https://upload.wikimedia.org/wikipedia)"
                  className="!border-y-0 rounded-none !border-r-0 mr-2"
                  id="backgroundImage"
                  onChange={handleOnChanges}
                  value={editor.editor.selectedElement.styles.backgroundImage}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image Position</Label>
              <ToggleGroup
                type="single"
                className="w-[274px] justify-between border rounded-md gap-4 items-center p-1"
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "backgroundSize",
                      value: e,
                    },
                  })
                }
                value={editor.editor.selectedElement.styles.backgroundSize?.toString()}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="cover">
                      <Expand className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Cover</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="contain">
                      <Shrink className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Contain</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="auto">
                      <LucideImageDown className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Auto</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Layout" className="px-6 py-0">
          <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Display Mode</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "display",
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Display Mode</SelectLabel>
                    <SelectItem value="flex">Flex</SelectItem>
                    <SelectItem value="inline-flex">Inline Flex</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="inline-block">Inline Block</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Justify Content</Label>
              <ToggleGroup
                type="single"
                className="w-[274px] justify-between border rounded-md gap-2 items-center p-1"
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "justifyContent",
                      value: e,
                    },
                  })
                }
                value={editor.editor.selectedElement.styles.justifyContent}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="space-between">
                      <AlignHorizontalSpaceBetween className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Space Between</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="space-around">
                      <AlignHorizontalSpaceAround className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Space Around</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="center">
                      <AlignHorizontalJustifyCenterIcon className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Center</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="flex-start">
                      <AlignHorizontalJustifyStart className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Start</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="flex-end">
                      <AlignHorizontalJustifyEnd className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>End</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Align Items</Label>
              <ToggleGroup
                type="single"
                className="w-[274px] justify-between border rounded-md gap-4 items-center p-1"
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "alignItems",
                      value: e,
                    },
                  })
                }
                value={editor.editor.selectedElement.styles.alignItems}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="center">
                      <AlignVerticalJustifyCenter className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Center</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="flex-start">
                      <AlignVerticalJustifyStart className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Start</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <ToggleGroupItem value="flex-end">
                      <AlignVerticalJustifyEnd className="w-5 h-5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>End</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Direction</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "flexDirection",
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Directions</SelectLabel>
                    <SelectItem value="row">Row</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                    <SelectItem value="row-reverse">Row Reverse</SelectItem>
                    <SelectItem value="column-reverse">
                      Column Reverse
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Dimensions" className="px-6 py-0 border-b-0">
          <AccordionTrigger className="!no-underline">
            Dimensions
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-col">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Height</Label>
                      <Input
                        id="height"
                        placeholder="px"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.height}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Width</Label>
                      <Input
                        placeholder="px"
                        id="width"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.width}
                      />
                    </div>
                  </div>
                </div>
                <Label className="w-full text-center">Margin (in px)</Label>
                <div className="flex gap-4 flex-col">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Top</Label>
                      <Input
                        id="marginTop"
                        placeholder="px"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.marginTop}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Bottom</Label>
                      <Input
                        placeholder="px"
                        id="marginBottom"
                        onChange={handleOnChanges}
                        value={
                          editor.editor.selectedElement.styles.marginBottom
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Left</Label>
                      <Input
                        placeholder="px"
                        id="marginLeft"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.marginLeft}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Right</Label>
                      <Input
                        placeholder="px"
                        id="marginRight"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.marginRight}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label className="w-full text-center">Padding (in px)</Label>
                <div className="flex gap-4 flex-col">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Top</Label>
                      <Input
                        placeholder="px"
                        id="paddingTop"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.paddingTop}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Bottom</Label>
                      <Input
                        placeholder="px"
                        id="paddingBottom"
                        onChange={handleOnChanges}
                        value={
                          editor.editor.selectedElement.styles.paddingBottom
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Left</Label>
                      <Input
                        placeholder="px"
                        id="paddingLeft"
                        onChange={handleOnChanges}
                        value={editor.editor.selectedElement.styles.paddingLeft}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Right</Label>
                      <Input
                        placeholder="px"
                        id="paddingRight"
                        onChange={handleOnChanges}
                        value={
                          editor.editor.selectedElement.styles.paddingRight
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default SettingsTab;
