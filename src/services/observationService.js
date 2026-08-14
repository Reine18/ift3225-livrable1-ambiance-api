const Observation = require("../models/Observation");

const {
  deleteCacheByPrefix,
} = require("../services/cacheService");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createObservationService(
  {
    location,
    vibe,
    sourceProximity,
    notes,
    timestamp,
    locationId,
  } = {},
  {
    authType,
    deviceId,
    authorId,
  } = {}
) {
  if (!location || !vibe) {
    throw createError(
      "location et vibe sont requis.",
      400
    );
  }

  const observationData = {
    location,
    locationId: locationId || null,
    vibe,
    sourceProximity,
    notes,
    timestamp: timestamp || Date.now(),
    deviceId: null,
    author: null,
  };

  if (authType === "device" && deviceId) {
    observationData.deviceId = deviceId;
  }

  if (authType === "user" && authorId) {
    observationData.author = authorId;
  }

  const observation = await Observation.create(observationData);

  // Invalide les listes après une création réussie.
  deleteCacheByPrefix("GET:/observations");
  deleteCacheByPrefix("GET:/ambiance");

  return observation;
}

async function getObservationsService() {
  return Observation.find()
    .populate("deviceId", "name location")
    .sort({ createdAt: -1 });
}

module.exports = {
  createObservationService,
  getObservationsService,
};