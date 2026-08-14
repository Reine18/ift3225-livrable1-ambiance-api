const Location = require("../models/Location");
const {
  deleteCacheByPrefix,
} = require("../services/cacheService");
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find()
      .select("idlocation name latitude longitude")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des lieux",
      error: error.message,
    });
  }
};

const createLocation = async (req, res) => {
  try {
    const { idlocation, name, latitude, longitude } = req.body;

    if (
      !idlocation ||
      !name ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "idlocation, name, latitude et longitude sont requis",
      });
    }

    const existingLocation = await Location.findOne({ idlocation });

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        message: "Ce lieu existe déjà",
      });
    }

    const location = await Location.create({
  idlocation,
  name,
  latitude,
  longitude,
});

// La liste des locations n'est plus à jour.
deleteCacheByPrefix("GET:/locations");

return res.status(201).json({
      success: true,
      message: "Lieu créé avec succès",
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du lieu",
      error: error.message,
    });
  }
};

module.exports = {
  getLocations,
  createLocation,
};