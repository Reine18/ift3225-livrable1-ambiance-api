const cache = new Map();

// Cherche une réponse déjà enregistrée.
function getCache(key) {
  const entry = cache.get(key);

  if (!entry) {
    return undefined;
  }

  // Supprime l'entrée si elle est expirée.
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  return entry.value;
}

// Enregistre une réponse pendant ttlMs millisecondes.
function setCache(key, value, ttlMs) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

// Supprime une entrée précise.
function deleteCache(key) {
  cache.delete(key);
}

// Supprime toutes les entrées qui commencent par prefix.
function deleteCacheByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

// Supprime toutes les entrées du cache.
function clearCache() {
  cache.clear();
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix,
  clearCache,
};