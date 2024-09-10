"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
const date = DateTime.local().toString();

const Pending = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async (date) => {
    const response = await fetch(`/api/orders/complete?date=${date}`);
    const results = await response.json();
    setOrders(results.data);
  };

  useEffect(() => {
    getOrders(date);
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
        </li>
      ))}
    </ul>
  );
};

export default Pending;
