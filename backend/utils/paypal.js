async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;
  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;

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
