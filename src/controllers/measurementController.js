const Measurement = require("../models/Measurement");

// POST /measurements
const createMeasurement = async (req, res) => {
  try {
    const { soundLevel, amplitude, timestamp } = req.body || {};

    if (soundLevel === undefined || amplitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Les champs soundLevel et amplitude sont requis.",
      });
    }

    const measurement = await Measurement.create({
      deviceId: req.device._id,
      soundLevel,
      amplitude,
      timestamp: timestamp || Date.now(),
    });

    return res.status(201).json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la mesure.",
      error: error.message,
    });
  }
};

// GET /measurements
const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find()
      .populate("deviceId", "name location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des mesures.",
      error: error.message,
    });
  }
};

module.exports = {
  createMeasurement,
  getMeasurements,
};