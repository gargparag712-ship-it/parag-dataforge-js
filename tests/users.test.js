const test = require('node:test');
const assert = require('node:assert/strict');
const { generateUsers } = require('../src/generators/users');

test('generateUsers returns the requested number of users with the expected fields', () => {
  const users = generateUsers(3);

  assert.equal(users.length, 3);
  for (const user of users) {
    assert.deepEqual(Object.keys(user), [
      'id', 'firstName', 'lastName', 'fullName', 'email', 'age'
    ]);
    assert.equal(user.fullName, `${user.firstName} ${user.lastName}`);
    assert.match(user.email, /^[a-z]+\.[a-z]+\.\d+@example\.com$/);
    assert.ok(Number.isInteger(user.age));
    assert.ok(user.age >= 18 && user.age <= 80);
  }
});

test('generateUsers gives every user a unique email address', () => {
  const users = generateUsers(100);
  const emails = users.map((user) => user.email);

  assert.equal(new Set(emails).size, emails.length);
});

test('generateUsers returns an empty array for a count of zero', () => {
  assert.deepEqual(generateUsers(0), []);
});

test('generateUsers rejects invalid counts with a clear error', () => {
  for (const count of [-1, 1.5, NaN, '2', null, undefined]) {
    assert.throws(
      () => generateUsers(count),
      { name: 'TypeError', message: 'count must be a non-negative integer.' }
    );
  }
});
