const express = require("express");

const protect = require("../middlewares/authMiddleware");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

const {
  createObservation,
  getObservations,
} = require("../controllers/observationController");

const router = express.Router();
//temporaire 
router.get(
  "/",
  (req, res, next) => {
    console.log("OBSERVATION ROUTE AVEC CACHE");
    next();
  },
  cacheMiddleware(60 * 1000),
  getObservations
);

// Lecture publique : cache pendant 60 secondes.
router.get(
  "/",
  cacheMiddleware(60 * 1000),
  getObservations
);

// Création protégée : jamais mise en cache.
router.post(
  "/",
  protect,
  createObservation
);

module.exports = router;