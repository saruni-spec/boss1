import { query } from "../../db";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import styles from "./page.module.css";
import OrdersGraph from "./components/OrdersGraph";
import SalesGraph from "./components/SalesGraph";
import Comparison from "./components/Comparison";

const date = DateTime.local().toString();

const getMetaData = async (date) => {
  try {
    const dateOnly = date.split("T")[0];
    const getOrdersPaid = `SELECT 
    DATE(s.Date_Sold) AS sale_date,
    SUM(s.Total_Cost) AS total_sales,
    SUM(s.Amount_Paid) AS total_paid,
    SUM(s.Amount_Owed) AS total_owed,
    COUNT(DISTINCT s.id) AS number_of_sales
FROM 
    Sales s
WHERE s.Date_Sold >= DATE(?, '-10 days') AND s.Payment_Status=TRUE
GROUP BY 
    DATE(s.Date_Sold)
ORDER BY 
    sale_date DESC
 ;`;
    const getOrdersUnpaid = `SELECT 
 DATE(s.Date_Sold) AS sale_date,
 SUM(s.Total_Cost) AS total_sales,
 SUM(s.Amount_Paid) AS total_paid,
 SUM(s.Amount_Owed) AS total_owed,
 COUNT(DISTINCT s.id) AS number_of_sales
FROM 
 Sales s
 WHERE s.Date_Sold >= DATE(?, '-10 days') AND s.Payment_Status=FALSE
GROUP BY 
 DATE(s.Date_Sold)
ORDER BY 
 sale_date DESC
;`;
    const getMilkData = `SELECT * FROM Milk WHERE Date >= DATE(?, '-10 days');`;
    const [paidOrdersData, unpaidOrdersData, milkData] = await Promise.all([
      await query(getOrdersPaid, [dateOnly]),
      await query(getOrdersUnpaid, [dateOnly]),
      await query(getMilkData, [dateOnly]),
    ]);

    return NextResponse.json({
      data: {
        orderData: {
          paidOrders: paidOrdersData,
          unpaidOrders: unpaidOrdersData,
        },
        milkData: milkData,
      },
      status: 201,
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({
      message: "Error fetching Orders last 10 days",
      status: 500,
    });
  }
};

const getTodatData = async (date) => {
  try {
    const dateOnly = date.split("T")[0];
    const getOrdersPaid = `SELECT
    DATE(s.Date_Sold) AS sale_date,
    SUM(s.Total_Cost) AS total_sales,
    SUM(s.Amount_Paid) AS total_paid,
    SUM(s.Amount_Owed) AS total_owed,
    COUNT(DISTINCT s.id) AS number_of_sales
FROM
    Sales s
WHERE 
    DATE(s.Date_Sold) = DATE(?)
    AND s.Payment_Status = TRUE
GROUP BY
    DATE(s.Date_Sold)
 `;
    const getOrdersUnpaid = `SELECT
    DATE(s.Date_Sold) AS sale_date,
    SUM(s.Total_Cost) AS total_sales,
    SUM(s.Amount_Paid) AS total_paid,
    SUM(s.Amount_Owed) AS total_owed,
    COUNT(DISTINCT s.id) AS number_of_sales
FROM
    Sales s
WHERE 
    DATE(s.Date_Sold) = DATE(?)
    AND s.Payment_Status = FALSE
GROUP BY
    DATE(s.Date_Sold)
`;
    const getMilk = `SELECT * FROM Milk WHERE DATE(Date) = DATE(?) ;`;
    const highestBuyer = `SELECT * FROM Sales WHERE DATE(Date_Sold)=DATE(?) ORDER BY Milk_ordered DESC LIMIT 1`;
    const highstDebtor = `SELECT * FROM Sales WHERE DATE(Date_Sold)=DATE(?) ORDER BY Amount_Owed DESC LIMIT 1`;

    const [paidOrders, unpaidOrders, milk, best, worst] = await Promise.all([
      await query(getOrdersPaid, [dateOnly]),
      await query(getOrdersUnpaid, [dateOnly]),
      await query(getMilk, [dateOnly]),
      await query(highestBuyer, [dateOnly]),
      await query(highstDebtor, [dateOnly]),
    ]);
    console.log(best, worst, "worst");

    return NextResponse.json({
      data: {
        orders: {
          paidOrdersToday: paidOrders,
          unpaidOrdersToday: unpaidOrders,
        },
        milk: milk,
        best: best[0],
        worst: worst[0],
      },
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching Orders for today",
      status: 500,
    });
  }
};

export default async function Home() {
  let metaDataResults = { orderData: [], milkData: [] };
  let todayResults = { orders: [], milk: [], best: null, worst: null };

  try {
    const [today, metaData] = await Promise.all([
      getTodatData(date),
      getMetaData(date),
    ]);

    metaDataResults = (await metaData.json())?.data || {
      orderData: [],
      milkData: [],
    };
    todayResults = (await today.json())?.data || {
      orders: [],
      milk: [],
      best: null,
      worst: null,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const { orderData = [], milkData = [] } = metaDataResults;
  const { orders = [], milk = [], best = null, worst = null } = todayResults;

  // Safely extract order data
  const { paidOrders = [], unpaidOrders = [] } = orderData || {};

  const { paidOrdersToday = [{}], unpaidOrdersToday = [{}] } = orders || [{}];

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

  const milkCostToday = milk?.[0]?.Bought_at * milk?.[0]?.Amount || 0;
  const grossProfit = paidToday - milkCostToday;
  const expectedProfit = milk?.[0]?.Selling_price * milk?.[0]?.Amount || 0;

  // Graph data
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
