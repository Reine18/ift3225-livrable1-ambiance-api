const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");
const {
  calculateAmbianceSummary,
  calculateQuietHours,
  calculateAmbianceForecast,
} = require("../services/ambianceService");

// GET /ambiance/:location/summary
const getAmbianceSummary = async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find()
      .populate("deviceId", "location")
      .sort({ timestamp: -1 });

    const observations = await Observation.find()
      .sort({ timestamp: -1 });

    const summary = calculateAmbianceSummary(location, measurements, observations);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Aucune donnée trouvée pour ce lieu.",
      });
    }

    return res.status(200).json({
      success: true,
      location,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors du calcul du résumé d'ambiance.",
      error: error.message,
    });
  }
};

// GET /ambiance/:location/history
const getAmbianceHistory = async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find()
      .populate("deviceId", "location")
      .sort({ timestamp: -1 });
      
    return res.status(200).json({
      success: true,
      location,
      count: locationMeasurements.length,
      data: locationMeasurements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique.",
      error: error.message,
    });
  }
};

// GET /ambiance/:location/quiet-hours
const getQuietHours = async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find()
      .populate("deviceId", "location");

    const quietHours = calculateQuietHours(location, measurements);

    if (!quietHours) {
      return res.status(404).json({
        success: false,
        message: "Aucune mesure trouvée pour ce lieu.",
      });
    }

    return res.status(200).json({
      success: true,
      location,
      data: quietHours,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors du calcul des heures calmes.",
      error: error.message,
    });
  }
};

// GET /ambiance/:location/forecast
const getAmbianceForecast = async (req, res) => {
  try {
    const { location } = req.params;
    const requestedHours = Number(req.query.hours) || 6;

    const forecast = calculateAmbianceForecast(
      location,
      measurements,
      requestedHours
    );

    if (!forecast) {
      return res.status(404).json({
        success: false,
        message: "Aucune mesure trouvée pour ce lieu.",
      });
    }

    return res.status(200).json({
      success: true,
      location,
      generatedAt: new Date().toISOString(),
      data: forecast,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors du calcul de la projection d'ambiance.",
      error: error.message,
    });
  }
};

module.exports = {
  getAmbianceSummary,
  getAmbianceHistory,
  getQuietHours,
  getAmbianceForecast,
};