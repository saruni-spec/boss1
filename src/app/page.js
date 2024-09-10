import { DateTime } from "luxon";
import styles from "./page.module.css";

const date = DateTime.local().toString();

export default async function Home() {
  const [metaData, today] = await Promise.all([
    await fetch("http://localhost:3000/api/metaData"),
    await fetch(`http://localhost:3000/api/today?date=${date}`),
  ]);

  const [metaDataResults, todayResults] = await Promise.all([
    await metaData.json(),
    await today.json(),
  ]);

  const { orderData, milkData } = metaDataResults;
  const { orders, milk, best, worst } = todayResults;

  const { paidOrders, unpaidOrders } = orderData.reduce(
    (acc, order) => {
      if (order.PaymentStatus === true) {
        acc.paidOrders.push(order); // Add to paid orders if PaymentStatus is true
      } else {
        acc.unpaidOrders.push(order); // Add to unpaid orders if PaymentStatus is false
      }
      return acc;
    },
    { paidOrders: [], unpaidOrders: [] } // Initial structure with empty arrays
  );

  const { paidOrdersToday, unpaidOrdersToday } = orders.reduce(
    (acc, order) => {
      if (order.PaymentStatus === true) {
        acc.paidOrders.push(order); // Add to paid orders if PaymentStatus is true
      } else {
        acc.unpaidOrders.push(order); // Add to unpaid orders if PaymentStatus is false
      }
      return acc;
    },
    { paidOrders: [], unpaidOrders: [] } // Initial structure with empty arrays
  );

  const paidAll = paidOrders.reduce((total, sale) => {
    total += sale.AmountPaid;
    return total;
  });
  const paidToday = paidOrdersToday.reduce((total, sale) => {
    total += sale.AmountPaid;
    return total;
  });

  const unpaidAll = unpaidOrders.reduce((total, sale) => {
    total += sale.AmountPaid;
    return total;
  });
  const unpaidToday = unpaidOrdersToday.reduce((total, sale) => {
    total += sale.AmountPaid;
    return total;
  });

  const milkCostToday = milk[0].Cost;
  const grossProfit = paidToday - milkCostToday;
  const expectedProfit = paidToday + unpaidToday - milkCostToday;

  const milkAll = milkData.reduce((total, milk) => {
    total += milk.Cost;
    return total;
  });
  const grossAll = paidAll - milkAll;
  const expectedAll = paidAll + unpaidAll - milkAll;

  return (
    <main className={styles.main}>
      <div>
        Total Milk Cost:{milkCostToday} Total Sales: {paidToday} Current Gross
        Profit :{grossProfit} Expected Gross Profit:{expectedProfit}
      </div>
      <div>Total Sales amount Grahp per day</div>
      <div>Gross Profit graph per day</div>
      <div>Orders per day graph</div>
      <div>
        Paid {paidToday} vs Unpaid {unpaidToday}
      </div>
      <div>Highest Buyer</div>
      <div>Hihest debtor</div>
    </main>
  );
}
