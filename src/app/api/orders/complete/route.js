export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const getSales = `SELECT * FROM Sales WHERE Date = ? AND Payment_Status=TRUE`;
    const { rows } = await query(getSales, [date]);
    return NextResponse.json({
      data: rows,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching sales ",
      status: 500,
    });
  }
}
