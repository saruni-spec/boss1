import { query } from "../../../../db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      amount,
      price,
      total,
      name,
      dateSold,
      datePaid,
      amountPaid,
      amountOwed,
      batchNo,
      paymentStatus,
    } = await req.json();

    const checkExistingUser = `SELECT * FROM customers WHERE shop_name = ? LIMIT 1;`;
    const reduceMilk = `UPDATE Milk 
    SET Amount_Sold = Amount_Sold + ?, 
        Amount_Remaining = Amount_Remaining - ? 
    WHERE Batch_No = ?`;
    const addOrder = `INSERT INTO Sales 
    (Milk_ordered,Bought_at,Total_Cost,Buyer,Payer,Date_Sold,Date_Paid,Amount_Paid,Amount_Owed,Batch_No,Payment_Status,customer_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const user = await query(checkExistingUser, [name]);
    let user_id = null;

    if (user && user.length > 0) {
      user_id = user[0].customer_id;
    } else {
      const newuser = await query(
        `INSERT INTO Customers (shop_name) VALUES (?) RETURNING*`,
        [name]
      );
      user_id = newuser[0].customer_id;
    }
    let payer = null;
    if (paymentStatus) {
      payer = name;
    }

    await Promise.all([
      await query(addOrder, [
        amount,
        price,
        total,
        name,
        payer,
        dateSold,
        datePaid,
        amountPaid,
        amountOwed,
        batchNo,
        paymentStatus,
        user_id,
      ]),
      await query(reduceMilk, [amount, amount, batchNo]),
    ]);

    return NextResponse.json(
      { message: "Order added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding Order:", error);
    return NextResponse.json(
      { message: "Error Adding Order, Please Try Again" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const geSales = `SELECT * FROM Sales WHERE Payment_Status=FALSE ORDER BY Date_Sold DESC`;
    const sales = await query(geSales);

    return NextResponse.json({
      data: sales,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching pending sales ",
      status: 500,
    });
  }
}
