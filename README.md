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
  exportToJSON,
  exportToCSV
} = require('parag-dataforge');
```

## Generate data

Each generator takes a non-negative integer count and returns an array. Random values use JavaScript's `Math.random()`, so results vary between calls.

```js
const users = generateUsers(10);
const products = generateProducts(8);
```

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
