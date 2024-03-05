import React from "react";

const BlurPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="h-screen overflow-auto backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black 
      mx-auto pt-24 p-4 absolute top-0 right-0 left-0 bottom-0 z-[11] scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium"
      id="blur-page" // for portals
    >
      {children}
    </div>
  );
};

export default BlurPage;
