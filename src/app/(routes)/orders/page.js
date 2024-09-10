"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountOwed, setAmountOwed] = useState(0);
  const [batchNo, setBatchNo] = useState(null);
  const [stock, setStock] = useState(0);
  const [milk, setCurrentMilk] = useState(null);
  const [message, setMessage] = useState(null);

  const saveOrder = async () => {
    if (amount > stock) {
      alert("Out of Stock");
      return;
    }
    if (amountPaid > amountOwed) {
      alert("Error with amount paid");
    }
    const dateSold = DateTime.local().toString();
    const datePaid = payment ? dateSold : null;
    const paymentStatus = amountPaid === total ? true : false;
    const results = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        amount,
        price,
        total,
        name,
        dateSold,
        datePaid,
        amountPaid,
        amountOwed,
        batchNo,
        paymentStatus,
      }),
    });

    getTodaysMilkPrice();
  };

  const togglePayment = () => {
    setPayment(!payment);
  };

  const calculatePayment = (amount) => {
    if (amount >= stock) {
      alert("Out of Stock");
      return;
    }
    setAmount(amount);
    setTotal(price * amount);
  };
  const changePayment = (priceChange) => {
    if (priceChange < milk.Selling_price) {
      setMessage("Current Price is below Buying price");
    } else {
      setMessage(null);
    }
    setPrice(priceChange);
    setTotal(priceChange * amount);
  };

  const makePayment = (amount) => {
    if (amountPaid > amountOwed) {
      setMessage("Error :Amount paid exceeds amount owed");
    } else {
      setMessage(null);
    }

    setAmountPaid(amount);
    setAmountOwed(total - amount);
  };

  const getTodaysMilkPrice = async () => {
    const date = DateTime.local().toString();
    const response = await fetch(`/api/milk?date=${date}`);
    const results = await response.json();
    console.log(results.data);
    if (results.data) {
      setStock(results.data.AmountRemaining);
      setPrice(results.data.Selling_price);
      setBatchNo(results.data.BatchNo);
      setCurrentMilk(results.data);
      return;
    }
  };

  useEffect(() => {
    getTodaysMilkPrice();
  }, []);

  return (
    <div>
      <label>Ordered By</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Amount in Stock</label>
      <p>{stock - amount}</p>
      <label>Amount Ordered</label>
      <input
        value={amount}
        onChange={(e) => calculatePayment(e.target.value)}
      />
      <label>Price Sold At</label>

      <input value={price} onChange={(e) => changePayment(e.target.value)} />
      <label>Total Owed</label>
      <p>{total}</p>
      <button onClick={togglePayment}>Add Payment</button>
      {payment && (
        <>
          <label>Amount Paid</label>
          <input
            value={amountPaid}
            onChange={(e) => makePayment(e.target.value)}
          />
          <label>Pending Payment {amountOwed}</label>
        </>
      )}
      {message && <p>{message}</p>}
      <button onClick={saveOrder}>Save Order</button>
    </div>
  );
};

export default Orders;
