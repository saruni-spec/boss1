import { query } from "../../../../db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
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
}
