import React from "react";
import Navigation from "@/components/modules/landing/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";

const layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </AuthProvider>
  );
};

export default layout;
