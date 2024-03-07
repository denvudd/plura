"use client";

import React from "react";
import { ProgressCircle } from "@tremor/react";

interface CircleProgressProps {
  value: number;
  description: React.ReactNode;
}

export const CircleProgress = ({ description, value = 0 }: CircleProgressProps) => {
  return (
    <div className="flex gap-4 items-center">
      <ProgressCircle
        showAnimation={true}
        value={value}
        radius={70}
        strokeWidth={20}
      >
        {value}%
      </ProgressCircle>
      <div>
        <b>Closing Rate</b>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};;
