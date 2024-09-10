import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const getOrders = `SELECT * FROM Sales WHERE Date_Sold >= DATE('now', '-10 days');`;
    const getMilkData = `SELECT * FROM Milk WHERE Date_Sold >= DATE('now', '-10 days');`;
    const [orderData, milkData] = await Promise.all([
      await query(getOrders),
      await query(getMilkData),
    ]);
    return NextResponse.json({
      data: { orderData, milkData },
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching Orders last 10 days",
      status: 500,
    });
  }
}
