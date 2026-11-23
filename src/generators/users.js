const firstNames = [
  'Ava', 'Liam', 'Mia', 'Noah', 'Sofia',
  'Ethan', 'Isabella', 'Lucas', 'Amara', 'Oliver'
];

const lastNames = [
  'Patel', 'Johnson', 'Garcia', 'Smith', 'Chen',
  'Brown', 'Khan', 'Wilson', 'Martin', 'Taylor'
];

/**
 * Generate an array of dummy users.
 * @param {number} count Number of users to generate.
 * @returns {{id: string, firstName: string, lastName: string, fullName: string, email: string, age: number}[]}
 */
function generateUsers(count, random = Math.random) {
  if (!Number.isInteger(count) || count < 0) {
    throw new TypeError('count must be a non-negative integer.');
  }

  const users = [];

  for (let index = 0; index < count; index += 1) {
    const firstName = firstNames[Math.floor(random() * firstNames.length)];
    const lastName = lastNames[Math.floor(random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    users.push({
      id: `user-${index + 1}`,
      firstName,
      lastName,
      fullName,
      // The index suffix keeps addresses unique even when names repeat.
      email: `${firstName}.${lastName}.${index + 1}@example.com`.toLowerCase(),
      age: Math.floor(random() * 63) + 18
    });
  }

  return users;
}

module.exports = { generateUsers };
