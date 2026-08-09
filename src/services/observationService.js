const Observation = require("../models/Observation");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createObservationService(
  //objets 1 contien les observation
  {
    location,
    vibe,
    sourceProximity,
    notes,
    timestamp,
    locationId,
  } = {},
  //deuxieme contien info dautho
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
//si requete vienr dun device lobservation est associee au device 
  if (authType === "device" && deviceId) {
    observationData.deviceId = deviceId;
  }
//si requete viebt dun user alors observation est associee a luser 
  if (authType === "user" && authorId) {
    observationData.author = authorId;
  }

  return Observation.create(observationData);
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