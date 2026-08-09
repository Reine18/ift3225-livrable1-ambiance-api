const Measurement = require("../models/Measurement");
const {
  deleteCacheByPrefix,
} = require("./cacheService");

// Crée une erreur avec un message et un code HTTP.
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Valide les données, crée une mesure et invalide le cache.
async function createMeasurementService({
  deviceId,
  soundLevel,
  amplitude,
  timestamp,
} = {}) {
  if (soundLevel === undefined || amplitude === undefined) {
    throw createError(
      "Les champs soundLevel et amplitude sont requis.",
      400
    );
  }

  if (!deviceId) {
    throw createError("Le deviceId est requis.", 400);
  }

  const measurement = await Measurement.create({
    deviceId,
    soundLevel,
    amplitude,
    timestamp: timestamp || Date.now(),
  });

  // Supprime les anciennes réponses devenues obsolètes.
  deleteCacheByPrefix("GET:/api/measurements");
  deleteCacheByPrefix("GET:/api/ambiance");

  return measurement;
}

// Récupère les mesures, ajoute les informations du device
// et trie les résultats par date de création.
async function getMeasurementsService() {
  return Measurement.find()
    .populate("deviceId", "name location")
    .sort({ createdAt: -1 });
}

module.exports = {
  createMeasurementService,
  getMeasurementsService,
};