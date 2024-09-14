"use client";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import styles from "./Add.module.css";

const Add = () => {
  const [milkAmount, setMilkAmount] = useState(0);
  const [amountInStock, setAmountInStock] = useState(0);
  const [milkPrice, setmilkPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const addMilk = async () => {
    console.log(milkAmount, "milk added in client");
    const date = DateTime.now();
    const response = await fetch("/api/milk", {
      method: "POST",
      body: JSON.stringify({
        Amount: milkAmount,
        Date: date.toString(),
        Cost: milkPrice * milkAmount,
        buyingPrice: milkPrice,
        sellingPrice: sellingPrice,
      }),
    });

    const results = await response.json();
    if (results.error) {
      alert(results.message);
      return;
    }

    setAmountInStock(results.data.Amount_Remaining);
    setmilkPrice(results.data.Bought_at);
  };

  const checkMilkAmount = async () => {
    const response = await fetch(`/api/milk`);

    const results = await response.json();
    const data = results.data;
    if (!data) {
      return;
    }
    setAmountInStock(data.Amount);
    setmilkPrice(data.Bought_at);
    setSellingPrice(data.Selling_price);
  };

  useEffect(() => {
    checkMilkAmount();
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Milk Inventory Management</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>Current Amount in Stock</label>
        <p className={styles.stockAmount}>{amountInStock} L</p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="milkPrice">
          Current Milk Price
        </label>
        <input
          id="milkPrice"
          className={styles.input}
          type="number"
          value={milkPrice}
          onChange={(e) => setmilkPrice(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="milkAmount">
          Add Milk Amount
        </label>
        <input
          id="milkAmount"
          className={styles.input}
          name="milk"
          type="number"
          value={milkAmount}
          onChange={(e) => setMilkAmount(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Total Cost</label>
        <p className={styles.totalCost}>
          Ksh.{(milkPrice * milkAmount).toFixed(2)}
        </p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="sellingPrice">
          Selling Price
        </label>
        <input
          id="sellingPrice"
          className={styles.input}
          type="number"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
      </div>

      <button className={styles.addButton} onClick={addMilk}>
        Add Milk
      </button>
    </div>
  );
};

export default Add;
