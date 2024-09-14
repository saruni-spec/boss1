import { query } from "../../../../../db";
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

    const reconsileSale = `UPDATE Sales SET Payer=?,Date_Paid=?,Amount_Paid=?,Amount_Owed=?,Payment_Status=?,Payment_id=? WHERE id=?`;

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

export async function GET() {
  try {
    const getMilk = `SELECT * FROM Payments WHERE isReconcilled=FALSE ORDER BY Time DESC`;
    const { rows } = await query(getMilk);
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
