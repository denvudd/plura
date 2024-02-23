import React from "react";
import Loading from "@/components/ui/loading";

const AgencyLoading: React.FC = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loading />
    </div>
  );
};

export default AgencyLoading;
