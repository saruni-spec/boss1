import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getOrders = `SELECT * FROM Sales WHERE Date_Sold = ? ;`;
    const getMilk = `SELECT * FROM Milk WHERE Date = ? ;`;
    const highestBuyer = `SELECT * FRM Sales WHERE Date=? ORDER BY Milk_ordered DESC LIMIT 1`;
    const highstDebtor = `SELECT * FRM Sales WHERE Date=? ORDER BY Amount_Owed DESC LIMIT 1`;

    const [orders, milk, best, worst] = await Promise.all([
      await query(getOrders, [date]),
      await query(getMilk, [date]),
      await query(highestBuyer, [date]),
      await query(highstDebtor, [date]),
    ]);
    return NextResponse.json({
      data: { orders, milk, best, worst },
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching Orders for today",
      status: 500,
    });
  }
}
