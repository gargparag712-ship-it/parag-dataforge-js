/** Convert supported seeds into a stable 32-bit initial state. */
function seedToUint32(seed) {
  if (typeof seed !== 'number' && typeof seed !== 'string') {
    throw new TypeError('seed must be a finite number or a non-empty string.');
  }

  if (typeof seed === 'number' && !Number.isFinite(seed)) {
    throw new TypeError('seed must be a finite number or a non-empty string.');
  }

  if (typeof seed === 'string' && seed.length === 0) {
    throw new TypeError('seed must be a finite number or a non-empty string.');
  }

  const input = `${typeof seed}:${String(seed)}`;
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

/** Create an independent Mulberry32 random number generator in [0, 1). */
function createRandom(seed) {
  let state = seedToUint32(seed);

  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = { createRandom };
