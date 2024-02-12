import React from "react";
import Navigation from "@/components/site/navigation";

const layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  );
};

export default layout;
