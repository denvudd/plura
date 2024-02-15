import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default MainLayout;
