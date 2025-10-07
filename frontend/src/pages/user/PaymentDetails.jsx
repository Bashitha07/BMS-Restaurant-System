import React from 'react';
import { useParams } from 'react-router-dom';
import PaymentPortal from '../../components/PaymentPortal';

const PaymentDetails = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentPortal orderId={orderId} />
    </div>
  );
};

export default PaymentDetails;