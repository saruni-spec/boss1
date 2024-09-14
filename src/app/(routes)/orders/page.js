"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css";

const Orders = () => {
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(false);
  const [amountPaid, setAmount_Paid] = useState(0);
  const [amountOwed, setAmount_Owed] = useState(0);
  const [batchNo, setBatch_No] = useState(null);
  const [stock, setStock] = useState(0);
  const [milk, setCurrentMilk] = useState(null);
  const [message, setMessage] = useState(null);
  const [orderDate, setOrderDate] = useState(
    DateTime.local().toFormat("yyyy-MM-dd")
  );

  const saveOrder = async () => {
    if (amount > stock) {
      alert("Out of Stock");
      return;
    }
    if (amountPaid > amountOwed) {
      alert("Error with amount paid");
    }
    const dateSold = DateTime.fromFormat(orderDate, "yyyy-MM-dd").toISO();
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
    let milkPrice = milk.Selling_price;
    if (!milkPrice) {
      milkPrice = 0;
    }
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

    setAmount_Paid(amount);
    setAmount_Owed(total - amount);
  };

  const getTodaysMilkPrice = async () => {
    const date = DateTime.local().toString();
    const response = await fetch(`/api/milk`);
    const results = await response.json();
    console.log(results.data);
    if (results.data) {
      setStock(results.data.Amount_Remaining);
      setPrice(results.data.Selling_price);
      setBatch_No(results.data.Batch_No);
      setCurrentMilk(results.data);
      return;
    }
  };

  useEffect(() => {
    getTodaysMilkPrice();
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>New Order</h2>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="name">
          Ordered By
        </label>
        <input
          id="name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="orderDate">
          Order Date
        </label>
        <input
          id="orderDate"
          className={styles.input}
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Amount in Stock</label>
        <p className={styles.stockAmount}>{stock - amount} L</p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="amount">
          Amount Ordered
        </label>
        <input
          id="amount"
          className={styles.input}
          type="number"
          value={amount}
          onChange={(e) => calculatePayment(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="price">
          Price Sold At
        </label>
        <input
          id="price"
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => changePayment(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Total Owed</label>
        <p className={styles.totalOwed}>Ksh.{total}</p>
      </div>

      <button className={styles.toggleButton} onClick={togglePayment}>
        {payment ? "Hide Payment" : "Add Payment"}
      </button>

      {payment && (
        <div className={styles.paymentSection}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="amountPaid">
              Amount Paid
            </label>
            <input
              id="amountPaid"
              className={styles.input}
              type="number"
              value={amountPaid}
              onChange={(e) => makePayment(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Pending Payment</label>
            <p className={styles.pendingPayment}>Ksh.{amountOwed}</p>
          </div>
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}

      <button className={styles.saveButton} onClick={saveOrder}>
        Save Order
      </button>
    </div>
  );
};

export default Orders;
