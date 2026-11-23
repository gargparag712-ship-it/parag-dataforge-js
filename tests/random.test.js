const test = require('node:test');
const assert = require('node:assert/strict');
const { createRandom } = require('../src/core/random');

test('numeric seeds initialize identical sequences', () => {
  const first = createRandom(12345);
  const second = createRandom(12345);

  assert.deepEqual(Array.from({ length: 8 }, first), Array.from({ length: 8 }, second));
});

test('string seeds initialize identical sequences', () => {
  const first = createRandom('dataforge-seed');
  const second = createRandom('dataforge-seed');

  assert.deepEqual(Array.from({ length: 8 }, first), Array.from({ length: 8 }, second));
});

test('different seeds produce different sequences and values stay in [0, 1)', () => {
  const first = Array.from({ length: 8 }, createRandom(12345));
  const second = Array.from({ length: 8 }, createRandom(54321));

  assert.notDeepEqual(first, second);
  assert.ok(first.every((value) => value >= 0 && value < 1));
});

test('invalid seeds are rejected without coercion', () => {
  for (const seed of [undefined, null, '', NaN, Infinity, -Infinity, true, {}, []]) {
    assert.throws(
      () => createRandom(seed),
      { name: 'TypeError', message: 'seed must be a finite number or a non-empty string.' }
    );
  }
});

test('creating a seeded generator does not replace global Math.random', () => {
  const originalRandom = Math.random;
  createRandom(1);
  assert.equal(Math.random, originalRandom);
});
