// Simple in-memory cache for API responses
const cache = {};

function getCache(key) {
  const entry = cache[key];
  if (!entry) return null;
  // 10 min expiry
  if (Date.now() - entry.timestamp > 10 * 60 * 1000) {
    delete cache[key];
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  cache[key] = { value, timestamp: Date.now() };
}

module.exports = { getCache, setCache };
