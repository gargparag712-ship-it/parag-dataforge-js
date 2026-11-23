/** Convert an array of objects into a formatted JSON string. */
function exportToJSON(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array.');
  }

  return JSON.stringify(data, null, 2);
}

function formatCSVValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  // Keep numeric values numeric in spreadsheet programs. For stringified data,
  // prefix formula-leading text with an apostrophe before normal CSV escaping.
  let text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (typeof value !== 'number' && /^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  const escapedText = text.replace(/"/g, '""');

  if (/[",\r\n]/.test(text)) {
    return `"${escapedText}"`;
  }

  return escapedText;
}

/**
 * Convert an array of objects into CSV using the union of keys in first-seen order.
 * Formula-leading text is prefixed with an apostrophe for spreadsheet safety;
 * numeric values, including negative numbers, remain numeric.
 */
function exportToCSV(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array.');
  }

  if (data.length === 0) {
    return '';
  }

  for (const item of data) {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError('Each item in data must be a non-null object.');
    }
  }

  const headers = [];
  const seenHeaders = new Set();
  for (const item of data) {
    for (const header of Object.keys(item)) {
      if (!seenHeaders.has(header)) {
        headers.push(header);
        seenHeaders.add(header);
      }
    }
  }

  const rows = [headers.map(formatCSVValue).join(',')];

  for (const item of data) {
    rows.push(headers.map((header) => formatCSVValue(item[header])).join(','));
  }

  return rows.join('\n');
}

module.exports = { exportToJSON, exportToCSV };
