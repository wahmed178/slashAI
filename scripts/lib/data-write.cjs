/**
 * Shared write helper for the scheduled data-refresh scripts.
 *
 * Why this exists: most of these feeds (Reddit especially) block datacenter
 * IPs, so a fetch can "succeed" as a script while returning zero items. Writing
 * that empty result over a populated JSON file silently wipes the catalogue and
 * the next deploy ships a blank page. Every refresh script must therefore go
 * through `writeData`, which refuses to replace a populated file with nothing.
 */
const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {string} filePath              absolute path of the JSON file to write
 * @param {unknown} data                 the new payload
 * @param {object} options
 * @param {number} options.count         how many items the new payload holds
 * @param {(prev: any) => number} options.previousCount  item count of an existing payload
 * @param {string} options.label         human label, e.g. "deals"
 * @returns {boolean} true when the file was written
 */
function writeData(filePath, data, { count, previousCount, label }) {
  const previous = readJson(filePath);
  const before = previous ? Number(previousCount(previous)) || 0 : 0;

  if (count === 0 && before > 0) {
    console.log(
      `Nothing fetched for ${label} (upstream blocked or empty) - ` +
        `keeping the existing ${before} item(s) instead of wiping them.`,
    );
    return false;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${count} ${label} -> ${path.relative(process.cwd(), filePath)}`);
  return true;
}

module.exports = { readJson, writeData };
