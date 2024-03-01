import React from "react";

interface PaymentSuccessfullPageProps {
  searchParams: {
    payment_intent: string | undefined;
    payment_intent_client_secret: string | undefined;
    redirect_status: string | undefined;
  };
}

// WIP
const PaymentSuccessfullPage: React.FC<PaymentSuccessfullPageProps> = ({
  searchParams,
}) => {
  const { payment_intent, payment_intent_client_secret, redirect_status } =
    searchParams;

  return <div>page</div>;
};

export default PaymentSuccessfullPage;
