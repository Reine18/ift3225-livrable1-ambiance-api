const express = require("express");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

const {
  getLocations,
  createLocation,
} = require("../controllers/locationController");

const router = express.Router();
//temporaire
// Lecture publique : cache pendant une heure.
router.get(
  "/",
  (req, res, next) => {
    console.log("LOCATION CACHE ROUTE EXECUTED");
    next();
  },
  cacheMiddleware(60 * 60 * 1000),
  getLocations
);

// Écriture : pas de cache.
router.post(
  "/",
  createLocation
);

module.exports = router;