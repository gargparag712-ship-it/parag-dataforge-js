/**
 * Generate orders using the users and products provided by the caller.
 * @param {number} count Number of orders to generate.
 * @param {Array<object>} users Existing users that orders can reference.
 * @param {Array<object>} products Existing products that orders can contain.
 * @returns {{id: string, userId: string, items: {productId: string, quantity: number}[], total: number}[]}
 */
function generateOrders(count, users, products) {
  if (!Number.isInteger(count) || count < 0) {
    throw new TypeError('count must be a non-negative integer.');
  }

  if (count === 0) {
    return [];
  }

  if (!Array.isArray(users) || users.length === 0) {
    throw new TypeError('users must be a non-empty array when count is greater than zero.');
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new TypeError('products must be a non-empty array when count is greater than zero.');
  }

  for (const user of users) {
    if (!user || typeof user.id !== 'string' || user.id.trim() === '') {
      throw new TypeError('Each user must have a non-empty string id.');
    }
  }

  for (const product of products) {
    if (!product || typeof product.id !== 'string' || product.id.trim() === '') {
      throw new TypeError('Each product must have a non-empty string id.');
    }

    if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) {
      throw new TypeError('Each product price must be a non-negative finite number.');
    }
  }

  // Treat records with the same ID as the same product for order items.
  const uniqueProducts = [];
  const seenProductIds = new Set();
  for (const product of products) {
    if (!seenProductIds.has(product.id)) {
      uniqueProducts.push(product);
      seenProductIds.add(product.id);
    }
  }

  const orders = [];

  for (let index = 0; index < count; index += 1) {
    const user = users[Math.floor(Math.random() * users.length)];
    const shuffledProducts = uniqueProducts.slice();

    // Shuffle a copy so this order can select distinct products.
    for (let position = shuffledProducts.length - 1; position > 0; position -= 1) {
      const swapIndex = Math.floor(Math.random() * (position + 1));
      [shuffledProducts[position], shuffledProducts[swapIndex]] = [
        shuffledProducts[swapIndex],
        shuffledProducts[position]
      ];
    }

    const maxItems = Math.min(3, shuffledProducts.length);
    const itemCount = Math.floor(Math.random() * maxItems) + 1;
    const items = [];

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      items.push({
        productId: shuffledProducts[itemIndex].id,
        quantity: Math.floor(Math.random() * 5) + 1
      });
    }

    const unroundedTotal = items.reduce((sum, item) => {
      const product = uniqueProducts.find((entry) => entry.id === item.productId);
      return sum + product.price * item.quantity;
    }, 0);
    const total = Math.round(unroundedTotal * 100) / 100;

    orders.push({
      id: `order-${index + 1}`,
      userId: user.id,
      items,
      total
    });
  }

  return orders;
}

module.exports = { generateOrders };
