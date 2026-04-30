// // import dotenv from "dotenv";
// // dotenv.config();
// // const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// // // 1. Get an access token securely from PayPal
// // async function getPayPalAccessToken() {
// //   const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString(
// //     "base64",
// //   );
// //   const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

// //   const response = await fetch(url, {
// //     method: "POST",
// //     headers: {
// //       Accept: "application/json",
// //       "Accept-Language": "en_US",
// //       Authorization: `Basic ${auth}`,
// //     },
// //     body: "grant_type=client_credentials",
// //   });

// //   if (!response.ok) throw new Error("Failed to get access token");
// //   const paypalData = await response.json();
// //   return paypalData.access_token;
// // }

// // // 2. Check our DB to ensure this receipt hasn't been used before (prevents replay attacks)
// // export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
// //   try {
// //     const orders = await orderModel.find({
// //       "paymentResult.id": paypalTransactionId,
// //     });
// //     return orders.length === 0;
// //   } catch (err) {
// //     console.error(err);
// //   }
// // }

// // // 3. Verify the actual transaction with PayPal
// // export async function verifyPayPalPayment(paypalTransactionId) {
// //   const accessToken = await getPayPalAccessToken();
// //   const paypalResponse = await fetch(
// //     `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
// //     {
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${accessToken}`,
// //       },
// //     },
// //   );
// //   if (!paypalResponse.ok) throw new Error("Failed to verify payment");

// //   const paypalData = await paypalResponse.json();
// //   return {
// //     verified: paypalData.status === "COMPLETED",
// //     value: paypalData.purchase_units[0].amount.value,

// //   };
// // }

// const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// async function getPayPalAccessToken() {
//   if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET || !PAYPAL_API_URL) {
//     throw new Error("Missing PayPal environment variables");
//   }

//   const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
//     "base64",
//   );

//   const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-Language": "en_US",
//       Authorization: `Basic ${auth}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: "grant_type=client_credentials",
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("PayPal access token error:", errorText);
//     throw new Error("Failed to get PayPal access token");
//   }

//   const paypalData = await response.json();
//   return paypalData.access_token;
// }

// export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
//   const orders = await orderModel.find({
//     "paymentResult.id": paypalTransactionId,
//   });

//   return orders.length === 0;
// }

// export async function verifyPayPalPayment(paypalOrderId) {
//   const accessToken = await getPayPalAccessToken();

//   const response = await fetch(
//     `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("PayPal verify payment error:", errorText);
//     throw new Error("Failed to verify PayPal payment");
//   }

//   const paypalData = await response.json();

//   return {
//     verified: paypalData.status === "COMPLETED",
//     value: paypalData.purchase_units[0].amount.value,
//     status: paypalData.status,
//   };
// }

async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;
  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;

  console.log("PAYPAL_CLIENT_ID:", PAYPAL_CLIENT_ID ? "exists" : "missing");
  console.log("PAYPAL_APP_SECRET:", PAYPAL_APP_SECRET ? "exists" : "missing");
  console.log("PAYPAL_API_URL:", PAYPAL_API_URL || "missing");

  if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET || !PAYPAL_API_URL) {
    throw new Error("Missing PayPal environment variables");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64",
  );

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal access token error:", errorText);
    throw new Error("Could not get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}
export async function createPayPalOrder(order) {
  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "CAD",
            value: Number(order.totalPrice).toFixed(2),
          },
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal create order error:", data);
    throw new Error("Could not create PayPal order");
  }

  return data;
}

export async function capturePayPalOrder(paypalOrderId) {
  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal capture order error:", data);
    throw new Error("Could not capture PayPal order");
  }

  return data;
}
