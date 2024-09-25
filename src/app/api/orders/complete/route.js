import { NextResponse } from "next/server";
import { query } from "../../../../../db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const dateOnly = date.split("T")[0];
    console.log(dateOnly);
    const getSales = `SELECT * FROM Sales WHERE DATE(Date_Sold) = DATE(?) AND Payment_Status=TRUE`;
    const results = await query(getSales, [dateOnly]);
    console.log(results);
    return NextResponse.json({
      data: results,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching sales ",
      status: 500,
    });
  }
}
