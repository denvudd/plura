import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlurPage from "@/components/common/BlurPage";

interface FunnelIdEditorPageProps {
  params: {
    funnelId: string | undefined;
    subaccountId: string | undefined;
  };
}

const FunnelIdEditorPage: React.FC<FunnelIdEditorPageProps> = async ({
  params,
}) => {
  const { funnelId, subaccountId } = params;

  return <BlurPage>4141</BlurPage>;
};

export default FunnelIdEditorPage;
