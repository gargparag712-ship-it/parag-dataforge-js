const { generateUsers } = require('./generators/users');
const { generateProducts } = require('./generators/products');
const { generateOrders } = require('./generators/orders');

module.exports = {
  generateUsers,
  generateProducts,
  generateOrders
};
