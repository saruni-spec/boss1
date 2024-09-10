"use client";
import React, { useEffect } from "react";

const Test = () => {
  const testapi = async () => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer Ar0Jc52pOzlxnV99nCAluSCaIrEp");
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ShortCode: 600987,
          ResponseType: "Completed",
          ConfirmationURL:
            "https://9702-41-90-175-4.ngrok-free.app/api/confirmationURL",
          ValidationURL:
            "https://9702-41-90-175-4.ngrok-free.app/api/validationURL",
        }),
      }
    );

    const results = await response.json();
    console.log(results);
  };
  useEffect(() => {
    testapi();
  }, []);
  return <div>Testing</div>;
};

export default Test;
