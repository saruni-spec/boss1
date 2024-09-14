import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
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
}
