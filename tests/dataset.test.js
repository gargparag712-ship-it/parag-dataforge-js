const test = require('node:test');
const assert = require('node:assert/strict');
const { createDataForge } = require('../src');

function assertUniqueIds(records) {
  const ids = records.map((record) => record.id);
  assert.equal(new Set(ids).size, ids.length);
}

test('generateDataset returns the requested related collections and preserves integrity', () => {
  const dataset = createDataForge({ seed: 12345 }).generateDataset({
    users: 10,
    products: 20,
    orders: 30
  });

  assert.deepEqual(Object.keys(dataset), ['users', 'products', 'orders']);
  assert.equal(dataset.users.length, 10);
  assert.equal(dataset.products.length, 20);
  assert.equal(dataset.orders.length, 30);
  assertUniqueIds(dataset.users);
  assertUniqueIds(dataset.products);
  assertUniqueIds(dataset.orders);

  const userIds = new Set(dataset.users.map((user) => user.id));
  const productsById = new Map(dataset.products.map((product) => [product.id, product]));
  for (const order of dataset.orders) {
    assert.ok(userIds.has(order.userId));

    const itemIds = order.items.map((item) => item.productId);
    assert.equal(new Set(itemIds).size, itemIds.length);

    const expectedTotal = order.items.reduce((sum, item) => {
      const product = productsById.get(item.productId);
      assert.ok(product);
      assert.ok(Number.isInteger(item.quantity) && item.quantity > 0);
      return sum + product.price * item.quantity;
    }, 0);
    assert.equal(order.total, Math.round(expectedTotal * 100) / 100);
  }
});

test('same-seed instances reproduce a complete dataset', () => {
  const first = createDataForge({ seed: 'complete-dataset' });
  const second = createDataForge({ seed: 'complete-dataset' });
  const options = { users: 7, products: 9, orders: 12 };

  assert.deepEqual(first.generateDataset(options), second.generateDataset(options));
});

test('different seeds normally generate different complete datasets', () => {
  const first = createDataForge({ seed: 10 }).generateDataset({
    users: 8,
    products: 8,
    orders: 8
  });
  const second = createDataForge({ seed: 11 }).generateDataset({
    users: 8,
    products: 8,
    orders: 8
  });

  assert.notDeepEqual(first, second);
});

test('generateDataset advances only its instance random stream', () => {
  const disturbed = createDataForge({ seed: 'dataset-isolation' });
  const independent = createDataForge({ seed: 'dataset-isolation' });
  const reference = createDataForge({ seed: 'dataset-isolation' });

  disturbed.generateDataset({ users: 2, products: 3, orders: 4 });
  assert.deepEqual(
    independent.generateDataset({ users: 3, products: 4, orders: 5 }),
    reference.generateDataset({ users: 3, products: 4, orders: 5 })
  );
});

test('repeated generateDataset calls advance the seeded stream instead of resetting it', () => {
  const forge = createDataForge({ seed: 'stream-advances' });
  const reference = createDataForge({ seed: 'stream-advances' });
  const options = { users: 5, products: 6, orders: 7 };

  const first = forge.generateDataset(options);
  const second = forge.generateDataset(options);

  assert.deepEqual(first, reference.generateDataset(options));
  assert.deepEqual(second, reference.generateDataset(options));
  assert.notDeepEqual(first, second);
});

test('empty options and zero counts return empty collections', () => {
  const forge = createDataForge({ seed: 1 });

  assert.deepEqual(forge.generateDataset({}), { users: [], products: [], orders: [] });
  assert.deepEqual(
    forge.generateDataset({ users: 0, products: 0, orders: 0 }),
    { users: [], products: [], orders: [] }
  );
});

test('orders require users and products', () => {
  const forge = createDataForge({ seed: 1 });

  assert.throws(() => forge.generateDataset({ orders: 1, products: 1 }), {
    name: 'TypeError',
    message: 'users must be greater than zero when orders is greater than zero.'
  });
  assert.throws(() => forge.generateDataset({ users: 1, orders: 1 }), {
    name: 'TypeError',
    message: 'products must be greater than zero when orders is greater than zero.'
  });
});

test('generateDataset rejects invalid options values', () => {
  const forge = createDataForge({ seed: 1 });

  for (const options of [null, undefined, [], 'dataset', 1]) {
    assert.throws(() => forge.generateDataset(options), {
      name: 'TypeError',
      message: 'dataset options must be a non-null object.'
    });
  }
});

test('generateDataset rejects invalid counts without coercion', () => {
  const forge = createDataForge({ seed: 1 });
  const invalidCounts = [-1, 1.5, '2', null, undefined];

  for (const field of ['users', 'products', 'orders']) {
    for (const count of invalidCounts) {
      assert.throws(() => forge.generateDataset({ [field]: count }), {
        name: 'TypeError',
        message: `${field} must be a non-negative integer.`
      });
    }
  }
});
