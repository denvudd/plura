"use client";

import React from "react";

import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as darkTheme } from "@clerk/themes";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{ baseTheme: theme === "dark" ? darkTheme : undefined }}
    >
      {children}
    </ClerkProvider>
  );
};

export default AuthProvider;
