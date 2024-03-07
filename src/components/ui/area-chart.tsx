"use client";

import React from "react";
import { AreaChart as AreaChartTremor } from "@tremor/react";

interface AreaChartProps {
  className?: string;
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  yAxisWidth?: number;
  showAnimation?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = (props) => {
  return <AreaChartTremor {...props} />;
};

