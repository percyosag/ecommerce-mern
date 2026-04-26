import dotenv from "dotenv";
dotenv.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// 1. Get an access token securely from PayPal
async function getPayPalAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString(
    "base64",
  );
  const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) throw new Error("Failed to get access token");
  const paypalData = await response.json();
  return paypalData.access_token;
}

// 2. Check our DB to ensure this receipt hasn't been used before (prevents replay attacks)
export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    const orders = await orderModel.find({
      "paymentResult.id": paypalTransactionId,
    });
    return orders.length === 0;
  } catch (err) {
    console.error(err);
  }
}

// 3. Verify the actual transaction with PayPal
export async function verifyPayPalPayment(paypalTransactionId) {
  const accessToken = await getPayPalAccessToken();
  const paypalResponse = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!paypalResponse.ok) throw new Error("Failed to verify payment");

  const paypalData = await paypalResponse.json();
  return {
    verified: paypalData.status === "COMPLETED",
    value: paypalData.purchase_units[0].amount.value, // The exact amount they paid
  };
}
