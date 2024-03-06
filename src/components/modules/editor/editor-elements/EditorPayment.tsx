import React from "react";
import { useRouter } from "next/navigation";

import { getSubAccountDetails } from "@/queries/subaccount";
import { getFunnel } from "@/queries/funnels";

import { useEditor } from "@/hooks/use-editor";
import type { EditorElement } from "@/lib/types/editor";
import { logger } from "@/lib/utils";
import { toast } from "sonner";

interface EditorPaymentProps {
  element: EditorElement;
}

const EditorPayment: React.FC<EditorPaymentProps> = ({ element }) => {
  const router = useRouter();
  const {
    editor: editorState,
    dispatch,
    funnelId,
    pageDetails,
    subAccountId,
  } = useEditor();

  const [clientSecret, setClientSecret] = React.useState<string>("");
  const [livePrices, setLivePrices] = React.useState([]);
  const [subAccountConnectedId, setSubAccountConnectedId] =
    React.useState<string>("");
  const options = React.useMemo(() => ({ clientSecret }), [clientSecret]);

  React.useEffect(() => {
    if (!subAccountId) return undefined;

    const fetchSubAccountConnectedId = async () => {
      const subAccountDetails = await getSubAccountDetails(subAccountId);

      if (subAccountDetails) {
        if (!subAccountDetails.connectAccountId) return undefined;

        setSubAccountConnectedId(subAccountDetails.connectAccountId);
      }
    };

    fetchSubAccountConnectedId();
  }, [subAccountId]);

  React.useEffect(() => {
    if (!funnelId) return undefined;

    const fetchFunnel = async () => {
      const funnelData = await getFunnel(funnelId);

      if (funnelData) {
        setLivePrices(JSON.parse(funnelData.liveProducts || "[]"));
      }
    };

    fetchFunnel();
  }, [funnelId]);

  React.useEffect(() => {
    if (!livePrices.length || !subAccountId || !subAccountConnectedId)
      return undefined;

    const getClientSecret = async () => {
      try {
        const payload = JSON.stringify({
          subAccountConnectedId,
          prices: livePrices,
          subAccountId,
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payload,
          }
        );

        const data = await response.json();

        if (!data) throw new Error("Something went wrong...");
        if (data.error) throw new Error(data.error);

        if (data.clientSecret) setClientSecret(data.clientSecret);
      } catch (error) {
        logger(error);
        toast.error("Oppse!", {
          description: "error.message",
          descriptionClassName: "line-clamp-3",
        });
      }

      getClientSecret();
    };
  }, []);

  return <div>EditorPayment</div>;
};

export default EditorPayment;
