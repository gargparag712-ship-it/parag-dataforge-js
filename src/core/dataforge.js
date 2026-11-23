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

  return {
    generateUsers(count) {
      return generateUsers(count, random);
    },
    generateProducts(count) {
      return generateProducts(count, random);
    },
    generateOrders(count, users, products) {
      return generateOrders(count, users, products, random);
    }
  };
}

module.exports = { createDataForge };
