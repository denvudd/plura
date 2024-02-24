import React from "react";
import Loading from "@/components/ui/loading";

const PipelinesLoading: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loading />
    </div>
  );
};

export default PipelinesLoading;
