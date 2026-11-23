const test = require('node:test');
const assert = require('node:assert/strict');
const {
  generateUsers,
  generateProducts,
  generateOrders
} = require('../src');

test('public API exports all three generator functions', () => {
  assert.equal(typeof generateUsers, 'function');
  assert.equal(typeof generateProducts, 'function');
  assert.equal(typeof generateOrders, 'function');
});

test('public API generators can create valid users, products, and orders', () => {
  const users = generateUsers(2);
  const products = generateProducts(4);
  const orders = generateOrders(3, users, products);

  assert.equal(users.length, 2);
  assert.ok(users.every((user) => user.id && user.fullName && user.email));

  assert.equal(products.length, 4);
  assert.ok(products.every((product) => product.id && product.name && product.price > 0));

  assert.equal(orders.length, 3);
  assert.ok(orders.every((order) => (
    users.some((user) => user.id === order.userId)
    && order.items.length >= 1
    && order.items.every((item) => products.some((product) => product.id === item.productId))
    && order.total > 0
  )));
});
