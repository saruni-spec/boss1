"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import styles from "@/app/components/Table.module.css";

const Payments = () => {
  const [payments, setPayments] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getPayments = async () => {
    const date = DateTime.local().toString();
    const response = await fetch(`/api/payments`);
    const results = await response.json();
    setPayments(results.data);
  };

  useEffect(() => {
    getPayments();
  }, []);

  const filteredPayments = payments?.filter((payment) =>
    payment.Paid_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payments Made Today</h2>
      <input
        type="text"
        placeholder="Search by user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {filteredPayments && filteredPayments.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Paid By</th>
              <th>Amount Paid</th>
              <th>Time</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.Transaction_ID}>
                <td>{payment.Paid_by}</td>
                <td>${payment.Amount_Paid}</td>
                <td>{`${payment.Time.split("T")[0]} : ${
                  payment.Time.split("T")[1].split("+")[0]
                }`}</td>
                <td>{payment.Transaction_ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Payments Found</p>
      )}
    </div>
  );
};

export default Payments;
