const {
  getCache,
  setCache,
} = require("../services/cacheService");

// Reçoit la durée de conservation du cache.
function cacheMiddleware(ttlMs) {
  return (req, res, next) => {
    console.log(
  "CACHE MIDDLEWARE EXECUTED:",
  req.method,
  req.originalUrl
);
    // Les opérations autres que GET ne sont jamais mises en cache.
    if (req.method !== "GET") {
      return next();
    }

    // Les requêtes avec un token ou une clé API ne sont pas mises en cache.
    if (
      req.headers.authorization ||
      req.headers["x-api-key"]
    ) {
      return next();
    }

    // L'URL complète permet de différencier les paramètres de requête.
    const cacheKey = `${req.method}:${req.originalUrl}`;
    res.set(
        "Cache-Control",
        `public, max-age=${Math.floor(ttlMs / 1000)}`
    );



    

    // Recherche une réponse déjà enregistrée.
    const cachedResponse = getCache(cacheKey);

    // Si une réponse existe, on la renvoie sans consulter MongoDB.
    if (cachedResponse !== undefined) {
      res.set("X-Cache", "HIT");

       // Indique aux caches la durée de validité de la réponse.
        res.set(
          "Cache-Control",
          `public, max-age=${Math.floor(ttlMs / 1000)}`
        );

      return res.status(200).json(cachedResponse);
    }

    // Sauvegarde la fonction res.json originale.
    const originalJson = res.json.bind(res);

    // Intercepte la réponse envoyée par le contrôleur.
    res.json = (data) => {
      // On ne conserve que les réponses réussies.
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(cacheKey, data, ttlMs);

       

        // Indique que la réponse vient d'être créée.
        res.set("X-Cache", "MISS");
      }

      // Envoie réellement la réponse au client.
      return originalJson(data);
    };

    // Continue vers le contrôleur.
    return next();
  };
}

module.exports = cacheMiddleware;