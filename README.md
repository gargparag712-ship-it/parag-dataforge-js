# parag-dataforge

`parag-dataforge` is a dependency-free CommonJS library for generating sample users, products, and orders, and exporting arrays of records as JSON or CSV. The generated data is intended for development and testing.

## Installation

```sh
npm install parag-dataforge
```

## CommonJS usage

```js
const {
  generateUsers,
  generateProducts,
  generateOrders,
  createDataForge,
  exportToJSON,
  exportToCSV
} = require('parag-dataforge');
```

## Seeded generation

Use `createDataForge({ seed })` to create an independent generator instance. Seeds can be finite numbers or non-empty strings:

```js
const numericForge = createDataForge({ seed: 12345 });
const stringForge = createDataForge({ seed: 'checkout-fixture' });

const users = numericForge.generateUsers(10);
const products = numericForge.generateProducts(8);
const orders = numericForge.generateOrders(12, users, products);
```

An instance owns its random state. Separate instances initialized with the same seed produce the same data when given the same arguments in the same sequence. Calls on one instance advance its stream and do not affect another instance. Reproducibility applies when the generator implementation and call sequence are unchanged.

## Generate a complete relational dataset

`generateDataset` creates users first, products second, and orders last, using the same seeded instance for every collection:

```js
const forge = createDataForge({ seed: 12345 });
const dataset = forge.generateDataset({
  users: 10,
  products: 20,
  orders: 30
});

const users = dataset.users;
const products = dataset.products;
const orders = dataset.orders;
```

Every generated order references a user in `dataset.users`; each order item references a product in `dataset.products`. Product references within an order are distinct, and totals are calculated from the referenced products and item quantities. Each collection's IDs are unique within that collection.

Two independent instances with the same seed and identical `generateDataset` arguments produce deeply equal datasets. Calling `generateDataset` advances that instance's random stream; it does not reset the seed. Counts default to zero when omitted, so `forge.generateDataset({})` returns `{ users: [], products: [], orders: [] }`. Counts must be non-negative integers, and a positive order count requires at least one user and one product.

## Generate data

The direct generator functions remain available for convenience. Each takes a non-negative integer count and returns an array. Direct calls use JavaScript's `Math.random()` and are not seeded or reproducible:

```js
const users = generateUsers(10);
const products = generateProducts(8);
```

For reproducible data, use the corresponding methods on a `createDataForge` instance.

Users contain `id`, `firstName`, `lastName`, `fullName`, `email`, and `age`. Products contain `id`, `name`, `category`, `price`, `stock`, and `sku`.

Generate orders by passing the users and products they may reference:

```js
const orders = generateOrders(12, users, products);
```

Each order has an `id`, a `userId` referencing one of the supplied users, `items` with `productId` references to supplied products and positive integer quantities, and a `total` calculated from those product prices. Each order includes between one and three distinct products, limited by the number of unique product IDs provided. For a positive order count, both input arrays must be non-empty and records must have valid IDs; product prices must be non-negative finite numbers. A zero order count returns an empty array.

## Export data

`exportToJSON(data)` returns a two-space-indented JSON string for an array:

```js
const json = exportToJSON(users);
```

`exportToCSV(data)` returns CSV text. It uses the union of object keys in first-seen order, leaves missing and null values empty, and serializes nested objects and arrays as JSON strings:

```js
const csv = exportToCSV(orders);
```

CSV fields are escaped using standard double-quote escaping for commas, quotes, and line breaks. Text values beginning with optional whitespace followed by `=`, `+`, `-`, or `@` receive a leading apostrophe to reduce spreadsheet formula-injection risk. Numeric values remain numeric, including ordinary negative numbers such as `-12.5`; a string such as `'-12.5'` is treated as text and receives the safety prefix. Empty input arrays export as an empty string in CSV and `[]` in JSON. Both exporters reject non-array input, and CSV also rejects records that are null, primitive values, or arrays.

## Development

The package uses Node.js built-in modules and has no runtime dependencies. Run the test suite with:

```sh
npm test
```

## License

MIT. See [LICENSE](LICENSE).
