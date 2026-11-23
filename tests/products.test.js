const test = require('node:test');
const assert = require('node:assert/strict');
const { generateProducts } = require('../src/generators/products');

const productCategories = {
  'Wireless Mouse': 'Electronics',
  'Bluetooth Speaker': 'Electronics',
  'USB-C Charger': 'Electronics',
  'Cotton T-Shirt': 'Clothing',
  'Denim Jeans': 'Clothing',
  'Wool Scarf': 'Clothing',
  'Hardcover Notebook': 'Stationery',
  'Fountain Pen': 'Stationery',
  'Colored Pencil Set': 'Stationery',
  'Ceramic Dinner Plate Set': 'Home & Kitchen',
  'Stainless Steel Kettle': 'Home & Kitchen',
  'Cotton Bath Towel': 'Home & Kitchen'
};

const priceRanges = {
  'Wireless Mouse': [15, 60],
  'Bluetooth Speaker': [25, 150],
  'USB-C Charger': [12, 45],
  'Cotton T-Shirt': [10, 40],
  'Denim Jeans': [35, 120],
  'Wool Scarf': [18, 70],
  'Hardcover Notebook': [5, 25],
  'Fountain Pen': [12, 80],
  'Colored Pencil Set': [6, 30],
  'Ceramic Dinner Plate Set': [20, 90],
  'Stainless Steel Kettle': [25, 110],
  'Cotton Bath Towel': [8, 45]
};

test('generateProducts returns the requested number with all required fields', () => {
  const products = generateProducts(12);

  assert.equal(products.length, 12);
  for (const product of products) {
    assert.deepEqual(Object.keys(product), [
      'id', 'name', 'category', 'price', 'stock', 'sku'
    ]);
  }
});

test('generateProducts gives each product a unique ID and SKU', () => {
  const products = generateProducts(40);
  const ids = products.map((product) => product.id);
  const skus = products.map((product) => product.sku);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(skus).size, skus.length);
  for (const product of products) {
    assert.match(product.id, /^product-\d+$/);
    assert.match(product.sku, /^(ELC|CLT|STN|HMK)-\d{4}$/);
  }
});

test('generateProducts keeps each product name matched to its category and price range', () => {
  const products = generateProducts(40);

  for (const product of products) {
    assert.equal(product.category, productCategories[product.name]);
    const [minPrice, maxPrice] = priceRanges[product.name];
    assert.ok(product.price >= minPrice && product.price <= maxPrice);
    assert.ok(product.price > 0);
  }

  assert.deepEqual(
    new Set(products.slice(0, 4).map((product) => product.category)),
    new Set(['Electronics', 'Clothing', 'Stationery', 'Home & Kitchen'])
  );
});

test('generateProducts uses non-negative integer stock quantities', () => {
  const products = generateProducts(40);

  for (const product of products) {
    assert.ok(Number.isInteger(product.stock));
    assert.ok(product.stock >= 0);
  }
});

test('generateProducts returns an empty array for a count of zero', () => {
  assert.deepEqual(generateProducts(0), []);
});

test('generateProducts rejects invalid counts with a clear error', () => {
  for (const count of [-1, 1.5, NaN, '2', null, undefined]) {
    assert.throws(
      () => generateProducts(count),
      { name: 'TypeError', message: 'count must be a non-negative integer.' }
    );
  }
});
