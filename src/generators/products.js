const productsByCategory = {
  Electronics: [
    { name: 'Wireless Mouse', minPrice: 15, maxPrice: 60 },
    { name: 'Bluetooth Speaker', minPrice: 25, maxPrice: 150 },
    { name: 'USB-C Charger', minPrice: 12, maxPrice: 45 }
  ],
  Clothing: [
    { name: 'Cotton T-Shirt', minPrice: 10, maxPrice: 40 },
    { name: 'Denim Jeans', minPrice: 35, maxPrice: 120 },
    { name: 'Wool Scarf', minPrice: 18, maxPrice: 70 }
  ],
  Stationery: [
    { name: 'Hardcover Notebook', minPrice: 5, maxPrice: 25 },
    { name: 'Fountain Pen', minPrice: 12, maxPrice: 80 },
    { name: 'Colored Pencil Set', minPrice: 6, maxPrice: 30 }
  ],
  'Home & Kitchen': [
    { name: 'Ceramic Dinner Plate Set', minPrice: 20, maxPrice: 90 },
    { name: 'Stainless Steel Kettle', minPrice: 25, maxPrice: 110 },
    { name: 'Cotton Bath Towel', minPrice: 8, maxPrice: 45 }
  ]
};

const categoryPrefixes = {
  Electronics: 'ELC',
  Clothing: 'CLT',
  Stationery: 'STN',
  'Home & Kitchen': 'HMK'
};

const categories = Object.keys(productsByCategory);

/**
 * Generate an array of dummy products.
 * @param {number} count Number of products to generate.
 * @returns {{id: string, name: string, category: string, price: number, stock: number, sku: string}[]}
 */
function generateProducts(count, random = Math.random) {
  if (!Number.isInteger(count) || count < 0) {
    throw new TypeError('count must be a non-negative integer.');
  }

  const products = [];

  for (let index = 0; index < count; index += 1) {
    // Rotate through categories so larger datasets include each category.
    const category = categories[index % categories.length];
    const categoryProducts = productsByCategory[category];
    const product = categoryProducts[Math.floor(random() * categoryProducts.length)];
    const priceInCents = Math.floor(
      random() * ((product.maxPrice - product.minPrice) * 100 + 1)
    ) + product.minPrice * 100;

    products.push({
      id: `product-${index + 1}`,
      name: product.name,
      category,
      price: priceInCents / 100,
      stock: Math.floor(random() * 501),
      sku: `${categoryPrefixes[category]}-${String(index + 1).padStart(4, '0')}`
    });
  }

  return products;
}

module.exports = { generateProducts };
