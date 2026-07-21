const Observation = require("../models/Observation");

// POST /observations
const createObservation = async (req, res) => {
  try {
    const {
      location,
      vibe,
      sourceProximity,
      notes,
      timestamp,
      locationId,
    } = req.body;

    if (!location || !vibe) {
      return res.status(400).json({
        success: false,
        message: "location et vibe sont requis.",
      });
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

    if (req.authType === "device" && req.device) {
      observationData.deviceId = req.device._id;
    }

    if (req.authType === "user" && req.user) {
      observationData.author = req.user.id;
    }

    const observation = await Observation.create(observationData);

    return res.status(201).json({
      success: true,
      data: observation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'observation.",
      error: error.message,
    });
  }
};



// GET /observations
const getObservations = async (req, res) => {
  try {
    const observations = await Observation.find()
      .populate("deviceId", "name location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des observations.",
      error: error.message,
    });
  }
};

module.exports = {
  createObservation,
  getObservations,
};


