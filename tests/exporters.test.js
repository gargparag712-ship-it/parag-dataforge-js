const test = require('node:test');
const assert = require('node:assert/strict');
const { exportToJSON, exportToCSV } = require('../src/utils/exporters');
const {
  generateUsers,
  generateProducts,
  generateOrders,
  exportToJSON: publicExportToJSON,
  exportToCSV: publicExportToCSV
} = require('../src');

test('exportToJSON serializes generated users, products, and nested orders as valid JSON', () => {
  const users = generateUsers(1);
  const products = generateProducts(2);
  const orders = generateOrders(1, users, products);

  for (const data of [users, products, orders]) {
    const json = exportToJSON(data);
    assert.equal(JSON.stringify(JSON.parse(json), null, 2), json);
  }

  const parsedOrders = JSON.parse(exportToJSON(orders));
  assert.ok(Array.isArray(parsedOrders[0].items));
});

test('exportToJSON returns formatted JSON and supports nested objects and arrays', () => {
  const data = [{ name: 'Sample', details: { tags: ['one', 'two'] } }];
  const json = exportToJSON(data);

  assert.equal(json, JSON.stringify(data, null, 2));
  assert.deepEqual(JSON.parse(json), data);
});

test('exportToCSV writes headers and rows from object keys', () => {
  const csv = exportToCSV([
    { name: 'Notebook', price: 9.5 },
    { name: 'Pen', price: 2 }
  ]);

  assert.equal(csv, 'name,price\nNotebook,9.5\nPen,2');
});

test('exportToCSV includes the union of keys in first-seen order and leaves missing values empty', () => {
  const csv = exportToCSV([
    { name: 'Parag', age: 20 },
    { name: 'Rahul', city: 'Delhi' }
  ]);

  assert.equal(csv, 'name,age,city\nParag,20,\nRahul,,Delhi');
});

test('exportToCSV quotes commas, double quotes, and newlines correctly', () => {
  const csv = exportToCSV([
    { comma: 'one, two', quote: 'She said "hello"', newline: 'first\nsecond' }
  ]);

  assert.equal(csv, 'comma,quote,newline\n"one, two","She said ""hello""","first\nsecond"');
});

test('exportToCSV prefixes formula-leading text while leaving negative numbers numeric', () => {
  const csv = exportToCSV([
    {
      equals: '=SUM(A1:A2)',
      plus: '+cmd|something',
      minus: '-cmd|something',
      at: '@SUM(A1:A2)',
      whitespace: '  =1+1',
      negativeNumber: -12.5,
      ordinaryText: 'regular value'
    }
  ]);

  assert.equal(
    csv,
    "equals,plus,minus,at,whitespace,negativeNumber,ordinaryText\n" +
      "'=SUM(A1:A2),'+cmd|something,'-cmd|something,'@SUM(A1:A2),'  =1+1,-12.5,regular value"
  );
});

test('exportToCSV also protects formula-like headers', () => {
  assert.equal(exportToCSV([{ '=formula': 'safe' }]), "'=formula\nsafe");
});

test('exportToCSV converts nested arrays and objects to JSON strings', () => {
  const csv = exportToCSV([{ items: [{ id: 1 }, { id: 2 }], address: { city: 'Pune' } }]);

  assert.equal(csv, 'items,address\n"[{""id"":1},{""id"":2}]","{""city"":""Pune""}"');
});

test('exportToCSV converts null and undefined values to empty fields', () => {
  const csv = exportToCSV([{ first: null, second: undefined, third: 'value' }]);

  assert.equal(csv, 'first,second,third\n,,value');
});

test('exportToCSV handles empty objects and reports circular nested values clearly', () => {
  assert.equal(exportToCSV([{}, {}]), '\n\n');

  const circular = {};
  circular.self = circular;
  assert.throws(() => exportToCSV([{ value: circular }]), {
    name: 'TypeError',
    message: /circular/i
  });
});

test('exportToCSV rejects null, string, and number records', () => {
  for (const record of [null, 'text', 42, []]) {
    assert.throws(
      () => exportToCSV([record]),
      { name: 'TypeError', message: 'Each item in data must be a non-null object.' }
    );
  }
});

test('both exporters handle empty arrays', () => {
  assert.equal(exportToJSON([]), '[]');
  assert.equal(exportToCSV([]), '');
});

test('both exporters reject values that are not arrays', () => {
  for (const value of [null, undefined, {}, 'text', 1]) {
    assert.throws(() => exportToJSON(value), {
      name: 'TypeError',
      message: 'data must be an array.'
    });
    assert.throws(() => exportToCSV(value), {
      name: 'TypeError',
      message: 'data must be an array.'
    });
  }
});

test('both exporters are available through the public API', () => {
  assert.equal(typeof publicExportToJSON, 'function');
  assert.equal(typeof publicExportToCSV, 'function');
  assert.equal(publicExportToJSON([{ ok: true }]), '[\n  {\n    "ok": true\n  }\n]');
  assert.equal(publicExportToCSV([{ ok: true }]), 'ok\ntrue');
});
