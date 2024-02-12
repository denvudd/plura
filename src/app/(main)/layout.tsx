import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as darkTheme } from "@clerk/themes";

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: darkTheme }}>
      {children}
    </ClerkProvider>
  );
};

export default MainLayout;
