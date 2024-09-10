import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { Amount, Cost, Date, sellingPrice, buyingPrice } = await req.json();

    const checkRemaining = `SELECT AmountRemaining FROM Milk ORDER BY Date DESC LIMIT 1`;
    const result = await query(checkRemaining);
    let prevAmount = 0;
    console.log(result, "prev");
    if (result && result.length > 0 && result[0].AmountRemaining !== null) {
      prevAmount = result[0].AmountRemaining;
    }
    console.log(Amount, "milk milk added in server");
    const totalAmount = parseFloat(Amount) + parseFloat(prevAmount);
    console.log(totalAmount, Amount, prevAmount, "amount");

    const addMilkQuery = `INSERT INTO MILK (Amount,Bought_at,AmountRemaining, Cost,Date,Selling_price,AmountSold) VALUES (?, ?,?,?,?,?,0) RETURNING*`;
    const results = await query(addMilkQuery, [
      Amount,
      buyingPrice,
      totalAmount,
      Cost,
      Date,
      sellingPrice,
    ]);
    console.log(results, "milk");
    return NextResponse.json(
      { data: results[0], message: "Milk added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding milk:", error);
    return NextResponse.json(
      { message: "Error Adding Milk, Please Try Again" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let results;
    if (date === "") {
      const getMilk = `SELECT * FROM MILK ORDER BY Date DESC LIMIT 1`;
      results = await query(getMilk);
    } else {
      const dateOnly = date.split("T")[0];

      const getMilk = `SELECT * FROM MILK WHERE DATE(Date) = DATE($1)`;
      results = await query(getMilk, [dateOnly]);
    }

    return NextResponse.json({
      data: results[0],
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching milk ",
      status: 500,
    });
  }
}
