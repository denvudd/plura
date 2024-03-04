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
  LucideImageDown,
  Shrink,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
        {editor.editor.selectedElement.type === "link" &&
          !Array.isArray(editor.editor.selectedElement.content) && (
            <AccordionItem value="Custom" className="px-6 py-0">
              <AccordionTrigger className="!no-underline">
                Custom
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Link Path</p>
                  <Input
                    id="href"
                    placeholder="https://domain.example.com/pathname"
                    onChange={handleChangeCustomValues}
                    value={editor.editor.selectedElement.content.href}
                  />
                </div>
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
              <Tabs
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "textAlign",
                      value: e,
                    },
                  })
                }
                value={editor.editor.selectedElement.styles.textAlign}
              >
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="left"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignLeft className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Left</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="center"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignCenter className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Center</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="right"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignRight className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Right</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <ColorPicker
                value={editor.editor.selectedElement.styles.color}
                className="w-full"
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
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <Label>Weight</Label>
                <Select
                  onValueChange={(e) =>
                    handleOnChanges({
                      target: {
                        id: "font-weight",
                        value: e,
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
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
                <div className="relative">
                  <Input
                    placeholder="px"
                    id="fontSize"
                    onChange={handleOnChanges}
                    defaultValue={18}
                    type="number"
                    value={editor.editor.selectedElement.styles.fontSize}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    px
                  </span>
                </div>
              </div>
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
                          editor.editor.selectedElement.styles?.opacity || "0"
                        ).replace("%", "")
                      ) || 0}
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
                defaultValue={[
                  typeof editor.editor.selectedElement.styles?.opacity ===
                  "number"
                    ? editor.editor.selectedElement.styles?.opacity
                    : parseFloat(
                        (
                          editor.editor.selectedElement.styles?.opacity || "0"
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
                value={editor.editor.selectedElement.styles.backgroundColor}
                className="w-full"
                onChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "backgroundColor",
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
              <Tabs
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
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="cover"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <Expand className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Cover</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="contain"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <Shrink className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Contain</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="auto"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <LucideImageDown className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Auto</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
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
              <Tabs
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
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="space-between"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignHorizontalSpaceBetween className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={16}>
                      <p>Space between</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="space-evenly"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignHorizontalSpaceAround className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Space Evenly</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="center"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignHorizontalJustifyCenterIcon className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Center</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="start"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                      >
                        <AlignHorizontalJustifyStart className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Start</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="end"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                      >
                        <AlignHorizontalJustifyEnd className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>End</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Align Items</Label>
              <Tabs
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
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="center"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignVerticalJustifyCenter className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Center</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="start"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                      >
                        <AlignVerticalJustifyStart className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Start</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <TabsTrigger
                        value="end"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                      >
                        <AlignVerticalJustifyEnd className="w-5 h-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>End</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
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

        <AccordionItem value="Dimensions" className="px-6 py-0 ">
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
