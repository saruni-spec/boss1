import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState(null);
  const [shops, setShops] = useState(null);

  const getPAyments = async () => {
    const date = DateTime.local().toString();
    const response = await fetch(`/api/payments?date=${date}`);
    const results = await response.json();
    setPayments(results.data);
  };

  const getShops = async () => {
    const response = await fetch(`/api/shops`);
    const results = await response.json();
    setShops(results.data);
  };

  useEffect(() => {
    getPAyments();
    getShops();
  }, []);
  return (
    <ul>
      {payments ? (
        payments.map((payment) => (
          <li key={payment.id}>
            <p>{payment.Paid_by}</p>
            <p>{payment.Amount_paid}</p>
            <p>{payment.Time}</p>
            <p>{payment.Transaction_ID}</p>
          </li>
        ))
      ) : (
        <>No Payments Made Today</>
      )}
    </ul>
  );
};

export default Payments;
