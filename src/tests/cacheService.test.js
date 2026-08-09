//fichier temporaire 

const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix,
  clearCache,
} = require("../services/cacheService");

clearCache();

setCache("GET:/api/test", { message: "ok" }, 1000);

console.log(getCache("GET:/api/test"));

deleteCache("GET:/api/test");

console.log(getCache("GET:/api/test"));
console.log("Test de suppression par préfixe");

setCache(
  "GET:/api/measurements",
  { id: 1 },
  1000
);

setCache(
  "GET:/api/measurements?location=salle-a",
  { id: 2 },
  1000
);

deleteCacheByPrefix("GET:/api/measurements");

console.log(getCache("GET:/api/measurements"));
console.log(
  getCache("GET:/api/measurements?location=salle-a")
);