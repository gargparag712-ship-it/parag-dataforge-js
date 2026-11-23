cat package.json# parag-dataforge

`parag-dataforge` is a lightweight JavaScript library for creating realistic dummy data for development and testing. It is intended to provide user and product data, along with orders that stay consistent with related records.

The project is in its initial setup stage. Data generators have not been implemented yet.

## Project structure

- `src/` — package source code and public entry point.
- `src/generators/` — data generator modules, such as users, products, and orders.
- `src/utils/` — shared helper functions used by the generators.
- `tests/` — automated tests for the package.
- `examples/` — small examples showing how to use the package.

## Development

This package uses CommonJS and requires Node.js. Once implementation begins, run the test suite with:

```sh
npm test
```

No runtime dependencies are currently required.

## License

MIT
