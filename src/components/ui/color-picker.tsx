"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";

interface ColorPickerProps {
  id?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({
  id,
  value,
  onChange,
  className,
}: ColorPickerProps) {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ];

  const gradients = [
    "linear-gradient(to bottom right,#accbee,#e7f0fd)",
    "linear-gradient(to bottom right,#d5d4d0,#d5d4d0,#eeeeec)",
    "linear-gradient(to bottom right,#000000,#434343)",
    "linear-gradient(to bottom right,#09203f,#537895)",
    "linear-gradient(to bottom right,#AC32E4,#7918F2,#4801FF)",
    "linear-gradient(to bottom right,#f953c6,#b91d73)",
    "linear-gradient(to bottom right,#ee0979,#ff6a00)",
    "linear-gradient(to bottom right,#F00000,#DC281E)",
    "linear-gradient(to bottom right,#00c6ff,#0072ff)",
    "linear-gradient(to bottom right,#4facfe,#00f2fe)",
    "linear-gradient(to bottom right,#0ba360,#3cba92)",
    "linear-gradient(to bottom right,#FDFC47,#24FE41)",
    "linear-gradient(to bottom right,#8a2be2,#0000cd,#228b22,#ccff00)",
    "linear-gradient(to bottom right,#40E0D0,#FF8C00,#FF0080)",
    "linear-gradient(to bottom right,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
    "linear-gradient(to bottom right,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left truncate font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2 truncate">
            {value ? (
              <div
                className="h-4 w-4 rounded-full !bg-cover !bg-center transition-all"
                style={{ background: value }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {value ? value : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue="solid" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                onClick={() => onChange(s)}
              />
            ))}
          </TabsContent>
          <TabsContent value="gradient" className="mt-0">
            <div className="mb-2 flex flex-wrap gap-1">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                  onClick={() => onChange(s)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id={id}
          value={value}
          className="col-span-2 mt-4 h-8 truncate"
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
