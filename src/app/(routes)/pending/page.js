"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import styles from "./Pending.module.css";

const date = DateTime.local().toString();

const Pending = () => {
  const [orders, setOrders] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [currentPayments, setCurrentPayments] = useState(null);

  const getOrders = async (date) => {
    const response = await fetch(`/api/orders`);
    const results = await response.json();
    setOrders(results.data);
  };

  const getPayments = async (date) => {
    const response = await fetch(`/api/payments/unreconcilled`);
    const results = await response.json();
    setCurrentPayments(results.data);
  };

  const automatePayments = async () => {
    if (!orders || !currentPayments) {
      return;
    }
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
    setOrders(orders.filter((o) => o.id !== order_id));
  };

  const makePayment = async (order, paymentDetails) => {
    const amountPaid = order.amountPaid + paymentDetails.Amount_Paid;
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
    <div className={styles.orderListContainer}>
      {orders && orders.length > 0 ? (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3 className={styles.orderTitle}>Order by {order.Buyer}</h3>
                <span className={styles.orderDate}>{order.Date_Sold}</span>
              </div>
              <div className={styles.orderDetails}>
                <p>
                  <strong>Bought By:</strong> {order.Buyer}
                </p>
                <p>
                  <strong>Milk Ordered:</strong> {order.Milk_Ordered} L
                </p>
                <p>
                  <strong>Price Per Litre:</strong> Ksh.{order.Bought_At}
                </p>
                <p>
                  <strong>Total Cost:</strong> Ksh.{order.Total_Cost}
                </p>
                <p>
                  <strong>Date Bought:</strong>{" "}
                  {`${order.Date_Sold.split("T")[0]} : ${
                    order.Date_Sold.split("T")[1].split("+")[0]
                  }`}{" "}
                </p>

                <p>
                  <strong>Amount Paid:</strong> Ksh.{order.Amount_Paid}
                </p>
                <p>
                  <strong>Date Paid:</strong>{" "}
                  {order.Date_Paid ? (
                    <>
                      {" "}
                      {`${order.Date_Paid.split("T")[0]} : ${
                        order.Date_Paid.split("T")[1].split("+")[0]
                      }` || "Not Paid"}
                    </>
                  ) : (
                    <>Not Paid</>
                  )}
                </p>
                <p>
                  <strong>Amount Owed:</strong> Ksh.{order.Amount_Owed}
                </p>

                <p>
                  <strong>Reconciled:</strong>{" "}
                  {order.isReconciled ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Customer ID:</strong> {order.customer_id}
                </p>
              </div>
              <div className={styles.orderActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => markAsPaid(order.id)}
                >
                  Mark As Paid
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => setIsPaid(true)}
                >
                  Add Payment Details
                </button>
              </div>
              {isPaid && (
                <div className={styles.paymentForm}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Amount Paid</label>
                    <input
                      className={styles.input}
                      type="number"
                      onChange={(e) =>
                        setPaymentDetails({
                          Amount_Paid: e.target.value,
                          Paid_by: order.Buyer,
                          Time: date,
                          id: null,
                        })
                      }
                    />
                  </div>
                  <p className={styles.orDivider}>Or</p>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Select From Pending Payments
                    </label>
                    <select className={styles.select}>
                      <option value="">Select</option>
                      {currentPayments ? (
                        currentPayments.map((current) => (
                          <option
                            key={current.id}
                            onSelect={() => setPaymentDetails(current)}
                          >
                            {current.Paid_by} Ksh.{current.Amount_Paid}{" "}
                            {current.Time}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Unreconciled Payments</option>
                      )}
                    </select>
                  </div>
                  <button
                    className={styles.submitButton}
                    onClick={() => makePayment(order, paymentDetails)}
                  >
                    Add Payment
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noOrders}>No Unpaid Orders</p>
      )}
    </div>
  );
};

export default Pending;
