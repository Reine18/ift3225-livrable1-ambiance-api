const cache = new Map();

export function getCachedData(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedData(key, data, ttl) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

export function removeCachedData(key) {
  cache.delete(key);
}

export function clearCache() {
  cache.clear();
}