"use client";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

const Add = () => {
  const [milkAmount, setMilkAmount] = useState(null);
  const [amountInStock, setAmountInStock] = useState(null);
  const [milkPrice, setmilkPrice] = useState(null);
  const [sellingPrice, setSellingPrice] = useState(null);

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

    setAmountInStock(results.data.AmountRemaining);
    setmilkPrice(results.data.Bought_at);
  };

  const checkMilkAmount = async () => {
    const response = await fetch(`/api/milk?date=${""}`);

    const results = await response.json();
    const data = results.data;
    setAmountInStock(data.Amount);
    setmilkPrice(data.Bought_at);
    setSellingPrice(data.Selling_price);
  };

  useEffect(() => {
    checkMilkAmount();
  }, []);

  return (
    <div>
      <label>Current Amount in Stock</label>
      <p>{amountInStock}</p>
      <label>Current Milk Price</label>
      <input value={milkPrice} onChange={(e) => setmilkPrice(e.target.value)} />
      <label>Add Milk Amount</label>
      <input
        name="milk"
        type="number"
        onChange={(e) => setMilkAmount(e.target.value)}
      />
      <p>Total Cost :{milkPrice * milkAmount}</p>
      <label>Selling Price</label>
      <input
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
      />

      <button onClick={addMilk}>Add</button>
    </div>
  );
};

export default Add;
