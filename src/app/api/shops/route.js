import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getShops = `SELECT shop_name FROM Customers`;
    const { rows } = await query(getShops, [date]);
    return NextResponse.json({
      data: rows,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching shops ",
      status: 500,
    });
  }
}
