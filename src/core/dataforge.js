const { createRandom } = require('./random');
const { generateUsers } = require('../generators/users');
const { generateProducts } = require('../generators/products');
const { generateOrders } = require('../generators/orders');

/** Create an isolated set of generators backed by a seeded random stream. */
function createDataForge(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object containing a seed.');
  }

  const random = createRandom(options.seed);

  function forgeUsers(count) {
    return generateUsers(count, random);
  }

  function forgeProducts(count) {
    return generateProducts(count, random);
  }

  function forgeOrders(count, users, products) {
    return generateOrders(count, users, products, random);
  }

  function generateDataset(datasetOptions) {
    if (
      datasetOptions === null
      || typeof datasetOptions !== 'object'
      || Array.isArray(datasetOptions)
    ) {
      throw new TypeError('dataset options must be a non-null object.');
    }

    const counts = {};
    for (const name of ['users', 'products', 'orders']) {
      const isProvided = Object.prototype.hasOwnProperty.call(datasetOptions, name);
      const count = isProvided ? datasetOptions[name] : 0;
      if (!Number.isInteger(count) || count < 0) {
        throw new TypeError(`${name} must be a non-negative integer.`);
      }
      counts[name] = count;
    }

    if (counts.orders > 0 && counts.users === 0) {
      throw new TypeError('users must be greater than zero when orders is greater than zero.');
    }
    if (counts.orders > 0 && counts.products === 0) {
      throw new TypeError('products must be greater than zero when orders is greater than zero.');
    }

    const users = forgeUsers(counts.users);
    const products = forgeProducts(counts.products);
    const orders = forgeOrders(counts.orders, users, products);

    return { users, products, orders };
  }

  return {
    generateUsers: forgeUsers,
    generateProducts: forgeProducts,
    generateOrders: forgeOrders,
    generateDataset
  };
}

module.exports = { createDataForge };
