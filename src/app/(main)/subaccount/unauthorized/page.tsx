import React from "react";
import Unauthorized from "@/components/common/Unauthorized";
import { constructMetadata } from "@/lib/utils";

const UnauthorizedPage: React.FC = () => <Unauthorized/>;

export default UnauthorizedPage;

export const metadata = constructMetadata({
    title: "Unauthorized - Plura",
  });
