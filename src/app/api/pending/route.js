import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getMilk = `SELECT * FROM Sales WHERE Date = $1 AND Paymet_Status=FALSE `;
    const { rows } = await query(getMilk, [date]);
    return NextResponse.json({
      data: rows,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching milk ",
      status: 500,
    });
  }
}
