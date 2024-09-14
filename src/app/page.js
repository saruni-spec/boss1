"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import styles from "./page.module.css";
import OrdersGraph from "./components/OrdersGraph";
import SalesGraph from "./components/SalesGraph";
import Comparison from "./components/Comparison";

export default function Home() {
  const [metaDataResults, setMetaDataResults] = useState({
    orderData: [],
    milkData: [],
  });
  const [todayResults, setTodayResults] = useState({
    orders: [],
    milk: [],
    best: null,
    worst: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const date = DateTime.local().toISO();
      setIsLoading(true);
      try {
        const [todayResponse, metaDataResponse] = await Promise.all([
          fetch(`/api/today?date=${date}`),
          fetch(`/api/metaData?date=${date}`),
        ]);

        if (!todayResponse.ok || !metaDataResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const todayData = await todayResponse.json();
        const metaData = await metaDataResponse.json();

        setTodayResults(
          todayData.data || { orders: [], milk: [], best: null, worst: null }
        );
        setMetaDataResults(metaData.data || { orderData: [], milkData: [] });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { orderData = [], milkData = [] } = metaDataResults;
  const { orders = [], milk = [], best = null, worst = null } = todayResults;

  // Safely extract order data
  const { paidOrders = [], unpaidOrders = [] } = orderData;
  const { paidOrdersToday = [{}], unpaidOrdersToday = [{}] } = orders;

  const paidAll = paidOrders.reduce(
    (total, sale) => total + (sale?.total_paid || 0),
    0
  );
  const unpaidAll = unpaidOrders.reduce(
    (total, sale) => total + (sale?.total_paid || 0),
    0
  );

  const paidToday = paidOrdersToday[0]?.total_paid || 0;
  const unPaidToday = unpaidOrdersToday[0]?.total_paid || 0;

  const milkCostToday = milk[0]?.Bought_at * milk[0]?.Amount || 0;
  const grossProfit = paidToday - milkCostToday;
  const expectedProfit = milk[0]?.Selling_price * milk[0]?.Amount || 0;

  // Graph data calculations (same as before)
  const salesDates = paidOrders.reduce((acc, order) => {
    const orderDate = DateTime.fromISO(order?.sale_date).toFormat("yyyy-MM-dd");
    if (!acc.includes(orderDate)) {
      acc.push(orderDate);
    }
    return acc;
  }, []);

  const unpaidDates = unpaidOrders.reduce((acc, order) => {
    const orderDate = DateTime.fromISO(order?.sale_date).toFormat("yyyy-MM-dd");
    if (!acc.includes(orderDate)) {
      acc.push(orderDate);
    }
    return acc;
  }, []);

  const salesData = paidOrders.map((order) => order?.total_sales || 0);
  const unpaidSalesData = unpaidOrders.map((order) => order?.total_owed || 0);

  const salesChartData = salesDates.map((date, index) => ({
    date,
    sales: salesData[index] || 0,
  }));
  const unPaidChart = unpaidDates.map((date, index) => ({
    date,
    sales: unpaidSalesData[index] || 0,
  }));

  const paidNoChart = [
    {
      data: "No of paid Orders",
      value: paidOrdersToday[0]?.number_of_sales || 0,
    },
    {
      data: "No of unpaid Orders",
      value: unpaidOrdersToday[0]?.number_of_sales || 0,
    },
  ];
  const paidTotalChart = [
    {
      data: "Value of Sales",
      value: paidToday.toFixed(2),
    },
    {
      data: "Value of unpaid Orders",
      value: unPaidToday.toFixed(2),
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.summary}>
        <p> Total Milk Cost: {milkCostToday.toFixed(2)} </p>
        <p>Total Sales: {paidToday.toFixed(2)}</p>
        <p>Current Gross Profit: {grossProfit.toFixed(2)} </p>
        <p>Expected Gross Profit: {expectedProfit.toFixed(2)}</p>
      </div>

      <div className={styles.graphContainer}>
        <SalesGraph data={salesChartData} />
      </div>
      <div className={styles.graphContainer}>
        <OrdersGraph data={unPaidChart} />
      </div>
      <div className={styles.graphContainer}>
        <Comparison chart1={paidNoChart} chart2={paidTotalChart} />
      </div>
      <div className={styles.highlight}>
        <div>
          <p> Highest Buyer: {best?.Buyer || "N/A"}</p>
          <p>Amount Of milk Bought: {best?.Milk_Ordered || 0}</p>
          <p>Amount paid Ksh. {best?.Total_Cost || 0}</p>
          <p>Price Per Litre : {best?.Bought_at || 0}</p>
        </div>
        <div>
          <p> Highest debtor: {worst?.Buyer || "N/A"}</p>
          <p>Amount Of milk Bought: {worst?.Milk_Ordered || 0}</p>
          <p>Amount paid Ksh. {worst?.Total_Cost || 0}</p>
          <p>Price Per Litre : {worst?.Bought_at || 0}</p>
        </div>
      </div>
    </div>
  );
}
