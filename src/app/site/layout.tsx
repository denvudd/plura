import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as darkTheme } from "@clerk/themes";

import Navigation from "@/components/site/navigation";

const layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: darkTheme }}>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default layout;
