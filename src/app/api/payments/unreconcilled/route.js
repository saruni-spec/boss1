import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      sales_id,
      payer,
      date,
      payment_id,
      amountOwed,
      amountPaid,
      paymentStatus,
    } = await req.json();

    const reconsileSale = `UPDATE Sales SET Payer=?,Date_paid=?,Amount_paid=?,Amount_owed=?,Payment_status=?,Payment_id=? WHERE id=?`;

    await query(reconsileSale, [
      payer,
      date,
      amountPaid,
      amountOwed,
      paymentStatus,
      payment_id,
      sales_id,
    ]);

    return NextResponse.json(
      { message: "Payment reconcilled successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error reconcilling Payment:", error);
    return NextResponse.json(
      { message: "Error reconcilling Payment, Please Try Again" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getMilk = `SELECT * FROM Payments WHERE Date = $1 AND isreconcilled=FALSE `;
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
