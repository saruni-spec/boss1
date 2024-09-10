import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getMilk = `SELECT * FROM Payments ORDER BY Time DESC `;
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

export async function POST(req) {
  try {
    const { sales_id, payer, date, amountOwed, amountPaid, paymentStatus } =
      await req.json();
    if (amountOwed) {
      const reconsileSale = `UPDATE Sales SET Payer=?,Date_paid=?,Amount_paid=?,Amount_owed=?,Payment_status=? WHERE id=?`;
      await query(reconsileSale, [
        date,
        payer,
        amountPaid,
        amountOwed,
        paymentStatus,
        sales_id,
      ]);
    } else {
      const reconsileSale = `UPDATE Sales SET Payer=Buyer,Date_paid=?,Amount_paid=Total_Cost,Amount_owed=0,Payment_status=TRUE WHERE id=?`;
      await query(reconsileSale, [date, sales_id]);
    }

    return NextResponse.json(
      { message: "Payment added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding Payment:", error);
    return NextResponse.json(
      { message: "Error adding Payment, Please Try Again" },
      { status: 500 }
    );
  }
}
