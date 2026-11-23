const { generateUsers } = require('./generators/users');
const { generateProducts } = require('./generators/products');
const { generateOrders } = require('./generators/orders');
const { exportToJSON, exportToCSV } = require('./utils/exporters');
const { createDataForge } = require('./core/dataforge');

module.exports = {
  generateUsers,
  generateProducts,
  generateOrders,
  createDataForge,
  exportToJSON,
  exportToCSV
};
