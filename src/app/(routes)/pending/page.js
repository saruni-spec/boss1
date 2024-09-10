"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
const date = DateTime.local().toString();
const Pending = () => {
  const [orders, setOrders] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [currentPayments, setCurrentPayments] = useState(null);

  const getOrders = async (date) => {
    const response = await fetch(`/api/orders?date=${date}`);
    const results = await response.json();
    setOrders(results.data);
  };

  const getPayments = async (date) => {
    const response = await fetch(`/api/payments/unreconcilled?date=${date}`);
    const results = await response.json();
    setCurrentPayments(results.data);
  };

  const automatePayments = async () => {
    // Create a map of orders keyed by the buyer's name
    const ordersByBuyer = orders.reduce((acc, order) => {
      if (!acc[order.Buyer]) {
        acc[order.Buyer] = [];
      }
      acc[order.Buyer].push(order);
      return acc;
    }, {});

    // Process each payment and update the corresponding order
    for (const payment of currentPayments) {
      const matchingOrders = ordersByBuyer[payment.Paid_by] || [];
      for (const order of matchingOrders) {
        await makePayment(order, payment);
      }
    }
  };

  const markAsPaid = async (order_id) => {
    await fetch(`/api/payments`, {
      method: "POST",
      body: JSON.stringify({
        sales_id: order_id,
        date: date,
        amountOwed: null,
        amountPaid: null,
        paymentStatus: null,
      }),
    });
  };

  const makePayment = async (order, paymentDetails) => {
    const amountPaid = order.amountPaid + paymentDetails.Amount_paid;
    const amountOwed = order.Total_Cost - amountPaid;
    const status = amountOwed === 0 ? true : false;

    await fetch("/api/payments/unreconcilled", {
      method: "POST",
      body: JSON.stringify({
        sales_id: order.id,
        payment_id: payer.id,
        payer: paymentDetails.Paid_by,
        date_paid: paymentDetails.Time,
        amountOwed: amountOwed,
        amountPaid: amountPaid,
        paymentStatus: status,
      }),
    });
    setOrders(orders.filter((o) => o.id !== order.id));
    setCurrentPayments(currentPayments.filter((p) => p.id !== payment.id));
  };

  useEffect(() => {
    getOrders(date);
    getPayments(date);
    automatePayments();
  }, []);

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          <p>{order.Date_Sold}</p>
          <p>{order.Milk_ordered}</p>
          <p>{order.Bought_at}</p>
          <p>{order.Total_Cost}</p>
          <p>{order.Buyer}</p>
          <p>{order.Date_Sold}</p>
          <p>{order.Date_Paid}</p>
          <p>{order.AmountPaid}</p>
          <p>{order.Amount_Owed}</p>
          <p>{order.BatchNo}</p>
          <p>{order.isReconciled}</p>
          <p>{order.customer_id}</p>
          <button onClick={() => markAsPaid(order.id)}>Mark As Paid</button>
          <button onClick={() => setIsPaid(true)}>Add Payment Details</button>
          {isPaid && (
            <>
              <label>Amount Paid</label>
              <input
                onChange={(e) =>
                  setPaymentDetails({
                    Amount_paid: e.target.value,
                    Paid_by: order.Buyer,
                    Time: date,
                    id: null,
                  })
                }
              />
              <p>Or</p>
              <label>Select From Panding Payments</label>
              <select>
                <option value={""}>Select</option>
                {currentPayments ? (
                  currentPayments.map((current) => (
                    <option
                      onSelect={() => setPaymentDetails(current)}
                      key={current.id}
                    >
                      <p>
                        {current.Paid_by} {current.Amount_paid} {current.Time}
                      </p>
                    </option>
                  ))
                ) : (
                  <>No Unreconciled Payments</>
                )}
              </select>
              <button onClick={() => makePayment(order, paymentDetails)}>
                Add Payment
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Pending;
