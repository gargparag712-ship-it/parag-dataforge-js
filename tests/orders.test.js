const test = require('node:test');
const assert = require('node:assert/strict');
const { generateOrders } = require('../src/generators/orders');

const users = [
  { id: 'user-1', fullName: 'Ava Patel' },
  { id: 'user-2', fullName: 'Liam Chen' }
];

const products = [
  { id: 'product-1', name: 'Wireless Mouse', price: 24.5 },
  { id: 'product-2', name: 'Cotton T-Shirt', price: 18 },
  { id: 'product-3', name: 'Hardcover Notebook', price: 9.25 },
  { id: 'product-4', name: 'Stainless Steel Kettle', price: 42 }
];

test('generateOrders returns the requested number of orders with required fields', () => {
  const orders = generateOrders(5, users, products);

  assert.equal(orders.length, 5);
  for (const order of orders) {
    assert.deepEqual(Object.keys(order), ['id', 'userId', 'items', 'total']);
    assert.ok(order.items.length >= 1 && order.items.length <= 3);
    for (const item of order.items) {
      assert.deepEqual(Object.keys(item), ['productId', 'quantity']);
    }
  }
});

test('generateOrders uses unique order IDs and references provided users and products', () => {
  const orders = generateOrders(20, users, products);
  const orderIds = orders.map((order) => order.id);
  const userIds = new Set(users.map((user) => user.id));
  const productIds = new Set(products.map((product) => product.id));

  assert.equal(new Set(orderIds).size, orderIds.length);
  for (const order of orders) {
    assert.ok(userIds.has(order.userId));
    for (const item of order.items) {
      assert.ok(productIds.has(item.productId));
    }
  }
});

test('generateOrders uses positive integer quantities and distinct products per order', () => {
  const orders = generateOrders(20, users, products);

  for (const order of orders) {
    const itemProductIds = order.items.map((item) => item.productId);
    assert.equal(new Set(itemProductIds).size, itemProductIds.length);
    for (const item of order.items) {
      assert.ok(Number.isInteger(item.quantity));
      assert.ok(item.quantity > 0);
    }
  }
});

test('generateOrders calculates each total from its product prices and quantities', () => {
  const orders = generateOrders(20, users, products);

  for (const order of orders) {
    const expectedTotal = order.items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return sum + product.price * item.quantity;
    }, 0);
    assert.equal(order.total, expectedTotal);
  }
});

test('generateOrders rounds the final total to two decimal places', () => {
  const precisionProducts = [
    { id: 'product-a', price: 0.1 },
    { id: 'product-b', price: 0.2 }
  ];
  const orders = generateOrders(50, users, precisionProducts);

  for (const order of orders) {
    const expectedTotal = order.items.reduce((sum, item) => {
      const product = precisionProducts.find((entry) => entry.id === item.productId);
      return sum + product.price * item.quantity;
    }, 0);

    assert.equal(order.total, Math.round(expectedTotal * 100) / 100);
    assert.equal(Number(order.total.toFixed(2)), order.total);
  }
});

test('generateOrders returns an empty array for a count of zero', () => {
  assert.deepEqual(generateOrders(0), []);
});

test('generateOrders rejects invalid counts', () => {
  for (const count of [-1, 1.5, NaN, '2', null, undefined]) {
    assert.throws(
      () => generateOrders(count, users, products),
      { name: 'TypeError', message: 'count must be a non-negative integer.' }
    );
  }
});

test('generateOrders rejects missing or empty user and product arrays', () => {
  assert.throws(() => generateOrders(1, [], products), /users must be a non-empty array/);
  assert.throws(() => generateOrders(1, users, []), /products must be a non-empty array/);
  assert.throws(() => generateOrders(1, null, products), /users must be a non-empty array/);
  assert.throws(() => generateOrders(1, users, undefined), /products must be a non-empty array/);
});

test('generateOrders rejects users and products with invalid IDs', () => {
  assert.throws(() => generateOrders(1, [{ id: '' }], products), /user must have a non-empty string id/);
  assert.throws(() => generateOrders(1, [null], products), /user must have a non-empty string id/);
  assert.throws(() => generateOrders(1, users, [{ id: 1, price: 10 }]), /product must have a non-empty string id/);
  assert.throws(() => generateOrders(1, users, [null]), /product must have a non-empty string id/);
});

test('generateOrders rejects invalid product prices', () => {
  for (const price of [-1, NaN, Infinity, '10', null]) {
    assert.throws(
      () => generateOrders(1, users, [{ id: 'product-x', price }]),
      /product price must be a non-negative finite number/
    );
  }
});
