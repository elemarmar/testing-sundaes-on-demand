import React from 'react';
import { useOrderDetails } from '../../contexts/OrderDetails';
import Options from './Options';

export default function OrderEntry({ setOrderPhase }) {
  const [orderDetails] = useOrderDetails();

  // disable order button if there aren't any scoops in order
  const orderDisabled = orderDetails.totals.scoops === '$0.00';
  return (
    <div>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand total: {orderDetails.totals.grandTotal}</h2>
      <button
        disabled={orderDisabled}
        type="button"
        onClick={() => setOrderPhase('review')}
      >
        Order Sundae!
      </button>
    </div>
  );
}
