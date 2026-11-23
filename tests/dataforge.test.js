const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createDataForge,
  generateUsers,
  generateProducts,
  generateOrders
} = require('../src');

test('same-seed instances generate identical users', () => {
  const first = createDataForge({ seed: 12345 });
  const second = createDataForge({ seed: 12345 });

  assert.deepEqual(first.generateUsers(5), second.generateUsers(5));
});

test('same-seed instances generate identical products', () => {
  const first = createDataForge({ seed: 'products' });
  const second = createDataForge({ seed: 'products' });

  assert.deepEqual(first.generateProducts(8), second.generateProducts(8));
});

test('same-seed instances reproduce users, products, and related orders for the same call sequence', () => {
  const first = createDataForge({ seed: 98765 });
  const second = createDataForge({ seed: 98765 });

  const usersA = first.generateUsers(5);
  const productsA = first.generateProducts(6);
  const ordersA = first.generateOrders(10, usersA, productsA);

  const usersB = second.generateUsers(5);
  const productsB = second.generateProducts(6);
  const ordersB = second.generateOrders(10, usersB, productsB);

  assert.deepEqual(usersA, usersB);
  assert.deepEqual(productsA, productsB);
  assert.deepEqual(ordersA, ordersB);
});

test('independent instances do not share random state', () => {
  const disturbed = createDataForge({ seed: 'isolation' });
  const independent = createDataForge({ seed: 'isolation' });
  const reference = createDataForge({ seed: 'isolation' });

  disturbed.generateProducts(20);
  assert.deepEqual(independent.generateUsers(5), reference.generateUsers(5));
});

test('different seeds normally produce different generated data', () => {
  const first = createDataForge({ seed: 1 });
  const second = createDataForge({ seed: 2 });

  assert.notDeepEqual(first.generateUsers(5), second.generateUsers(5));
});

test('createDataForge rejects missing and invalid seeds', () => {
  for (const options of [undefined, null, [], {}, { seed: '' }, { seed: true }]) {
    assert.throws(() => createDataForge(options), { name: 'TypeError' });
  }
});

test('direct generator APIs remain available and callable', () => {
  const users = generateUsers(2);
  const products = generateProducts(2);
  const orders = generateOrders(2, users, products);

  assert.equal(users.length, 2);
  assert.equal(products.length, 2);
  assert.equal(orders.length, 2);
});
