import React from "react";
import BlurPage from "@/components/common/BlurPage";

const PipelinesLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <BlurPage>{children}</BlurPage>;
};

export default PipelinesLayout;
