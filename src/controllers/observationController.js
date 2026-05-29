const Observation = require("../models/Observation");

// POST /observations
const createObservation = async (req, res) => {
  try {
    const { location, vibe, sourceProximity, notes, timestamp } = req.body;

    if (!location || !vibe) {
      return res.status(400).json({
        success: false,
        message: "location et vibe sont requis.",
      });
    }

    const observation = await Observation.create({
      deviceId: req.device._id,
      location,
      vibe,
      sourceProximity,
      notes,
      timestamp: timestamp || Date.now(),
    });

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