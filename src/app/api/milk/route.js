import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { Amount, Cost, Date, sellingPrice, buyingPrice } = await req.json();

    const checkRemaining = `SELECT Amount_Remaining FROM Milk ORDER BY Date DESC LIMIT 1`;
    const result = await query(checkRemaining);
    let prevAmount = 0;
    let accumulatingCost = 0;

    if (result && result.length > 0 && result[0].Amount_Remaining !== null) {
      prevAmount = result[0].Amount_Remaining;
      accumulatingCost = prevAmount * result[0].Bought_at;
    }

    const totalAmount = parseFloat(Amount) + parseFloat(prevAmount);
    const newTotal = parseFloat(accumulatingCost) + parseFloat(Cost);

    const addMilkQuery = `INSERT INTO MILK (Amount,Bought_at,Amount_Remaining, Cost,Date,Selling_price,Amount_Sold) VALUES (?, ?,?,?,?,?,0) RETURNING*`;
    const results = await query(addMilkQuery, [
      Amount,
      buyingPrice,
      totalAmount,
      newTotal,
      Date,
      sellingPrice,
    ]);

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

export async function GET() {
  try {
    const getMilk = `SELECT * FROM MILK ORDER BY Date DESC LIMIT 1`;
    const results = await query(getMilk);
    console.log(results);
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
