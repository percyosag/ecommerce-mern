function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems) {
  // Calculate the items price in whole numbers (pennies) to avoid floating-point math errors
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0,
  );

  // Calculate shipping: Free shipping over $100, otherwise $10
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Calculate tax: 13% tax rate
  const taxPrice = 0.13 * itemsPrice;

  // Calculate total
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
