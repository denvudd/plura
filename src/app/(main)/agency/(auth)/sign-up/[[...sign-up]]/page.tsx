import React from "react";
import { SignUp } from "@clerk/nextjs";
import { constructMetadata } from "@/lib/utils";

const Page: React.FC = ({}) => {
  return <SignUp />;
};

export default Page;

export const metadata = constructMetadata({
  title: "Sign Up - Plura",
});
