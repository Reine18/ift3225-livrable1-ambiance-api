const Measurement = require("../models/Measurement");

//creat une error avec un message et son code http
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
// valide les donneees et cree une mesure 
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

  return measurement;
}
// on recupere toutes les mesures et ajoute les info du device et trie les resultats par date de creation
async function getMeasurementsService() {
  return Measurement.find()
    .populate("deviceId", "name location")
    .sort({ createdAt: -1 });
}

module.exports = {
  createMeasurementService,
  getMeasurementsService,
};