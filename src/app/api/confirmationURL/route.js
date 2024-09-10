import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { query } from "../../../../db";

export async function POST(req) {
  try {
    // Parse the incoming JSON body
    const body = await req.json();

    const {
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      MSISDN,
      FirstName,
      MiddleName,
      LastName,
    } = body;
    const transactionTime = DateTime.fromFormat(
      TransTime,
      "yyyyMMddHHmmss"
    ).toString();
    // Log the parsed transaction details to ensure they are received correctly
    console.log(
      "Transaction ID: ",
      TransID,
      "Amount: ",
      TransAmount,
      "Time: ",
      transactionTime,
      "MiddleName: ",
      MiddleName,
      "LastName: ",
      LastName
    );
    const addPayment = `INSERT INTO PAYMENTS (Paid_by,
      Amount_paid,
      Time,
      Transaction_ID) VALUES(?,?,?,?)`;

    await query(addPayment, [
      `${FirstName} ${MiddleName} ${LastName}`,
      TransAmount,
      transactionTime,
      TransID,
    ]);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: "Failed to process",
    });
  }
}
