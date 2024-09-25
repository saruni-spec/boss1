// Client Component (Sales.js)
"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import styles from "@/app/components/Table.module.css";

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    DateTime.local().toISODate()
  );

  const getOrders = async (date) => {
    const response = await fetch(`/api/orders/complete?date=${date}`);
    const results = await response.json();
    setOrders(results.data);
  };

  useEffect(() => {
    getOrders(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Sales Completed on Selected Date</h2>
      <div className={styles.datePickerContainer}>
        <label htmlFor="datePicker">Select Date: </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={handleDateChange}
          max={DateTime.local().toISODate()}
        />
      </div>
      {orders && orders.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date Sold</th>
              <th>Milk Ordered</th>
              <th>Price</th>
              <th>Total Cost</th>
              <th>Buyer</th>
              <th>Date Paid</th>
              <th>Amount Paid</th>
              <th>Amount Owed</th>
              <th>Batch No</th>
              <th>Reconciled</th>
              <th>Customer ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{DateTime.fromISO(order.Date_Sold).toISODate()}</td>
                <td>{order.Milk_ordered}</td>
                <td>Ksh.{order.Bought_at}</td>
                <td>Ksh.{order.Total_Cost}</td>
                <td>{order.Buyer}</td>
                <td>
                  {order.Date_Paid
                    ? DateTime.fromISO(order.Date_Paid).toISODate()
                    : "N/A"}
                </td>
                <td>Ksh.{order.Amount_Paid}</td>
                <td>Ksh.{order.Amount_Owed}</td>
                <td>{order.Batch_No}</td>
                <td>{order.isReconciled ? "Yes" : "No"}</td>
                <td>{order.customer_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>No Sales Completed on {selectedDate}</p>
      )}
    </div>
  );
};

export default Sales;
