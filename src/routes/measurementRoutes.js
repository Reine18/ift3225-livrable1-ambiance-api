const express = require("express");

const protect = require("../middlewares/authMiddleware");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

const {
  createMeasurement,
  getMeasurements,
} = require("../controllers/measurementController");

const router = express.Router();

// Création d'une mesure : protégée et jamais mise en cache.
router.post(
  "/",
  protect,
  createMeasurement
);

// Récupération des mesures : réponse publique mise en cache 60 secondes.
router.get(
  "/",
  cacheMiddleware(60 * 1000),
  getMeasurements
);

module.exports = router;