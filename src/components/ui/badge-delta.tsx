"use client";

import React from "react";
import { BadgeDelta as BadgeDeltaTremor, BadgeDeltaProps as BadgeDeltaPropsTremor } from "@tremor/react";

interface BadgeDeltaProps extends BadgeDeltaPropsTremor {}

export const BadgeDelta: React.FC<BadgeDeltaProps> = (props) => {
  return (
    <BadgeDeltaTremor
      {...props}
    >
      +12.3%
    </BadgeDeltaTremor>
  );
};

