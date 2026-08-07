const Location = require("../models/Location");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getLocationsService() {
  return Location.find()
    .select("idlocation name latitude longitude")
    .sort({ name: 1 }); //on tri en ordre alphabetique 
}
// verifie les champs obligatoires 
// normalise idLocation en minuscule
//verifi si lieu existe sinon cree le lieu 
async function createLocationService({
  idlocation,
  name,
  latitude,
  longitude,
} = {}) {
  if (
  !idlocation ||
  !name ||
  latitude === undefined ||
  longitude === undefined
) {
  throw createError(
    "idlocation, name, latitude et longitude sont requis",
    400
  );
}

  const normalizedId = idlocation
    .trim()
    .toLowerCase();

  const existingLocation = await Location.findOne({
    idlocation: normalizedId,
  });

  if (existingLocation) {
    throw createError(
      "Ce lieu existe déjà",
      409
    );
  }

  return Location.create({
    idlocation: normalizedId,
    name: name.trim(),
    latitude,
    longitude,
  });
}

module.exports = {
  getLocationsService,
  createLocationService,
};