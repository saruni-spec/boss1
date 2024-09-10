import { NextResponse } from "next/server";

export async function GET(req, res) {
  const tokenResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getToken`
  );
  const { access_token } = await tokenResponse.json();

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ShortCode: process.env.MPESA_SHORTCODE,
        ResponseType: "Completed",
        ConfirmationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirmationURL`,
        ValidationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/validationURL`,
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
