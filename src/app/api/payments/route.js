import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const getMilk = `SELECT * FROM Payments ORDER BY Time DESC `;
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

export async function POST(req) {
  try {
    const { sales_id, payer, date, amountOwed, amountPaid, paymentStatus } =
      await req.json();
    if (amountOwed) {
      const reconsileSale = `UPDATE Sales SET Payer=?,Date_Paid=?,Amount_Paid=?,Amount_Owed=?,Payment_Status=? WHERE id=?`;
      await query(reconsileSale, [
        date,
        payer,
        amountPaid,
        amountOwed,
        paymentStatus,
        sales_id,
      ]);
    } else {
      const reconsileSale = `UPDATE Sales SET Payer=Buyer,Date_Paid=?,Amount_Paid=Total_Cost,Amount_Owed=0,Payment_Status=TRUE WHERE id=?`;
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
