import Image from "next/image";
import React from "react";

interface PaymentFormPlaceholderProps {}

const PaymentFormPlaceholder: React.FC<PaymentFormPlaceholderProps> = ({}) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("componentType", "paymentForm");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center cursor-grab"
    >
      <Image
        src="/stripelogo.png"
        width={40}
        height={40}
        alt="Stripe Logo"
        className="object-cover"
      />
    </div>
  );
};

export default PaymentFormPlaceholder;
