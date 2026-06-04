const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");

// GET /ambiance/:location/summary
const getAmbianceSummary = async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find()
      .populate("deviceId", "location")
      .sort({ timestamp: -1 });

    const locationMeasurements = measurements.filter(
      (m) => m.deviceId && m.deviceId.location === location
    );

    const observations = await Observation.find({ location }).sort({
      timestamp: -1,
    });

    if (locationMeasurements.length === 0 && observations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune donnée trouvée pour ce lieu.",
      });
    }

    const avgSoundLevel =
      locationMeasurements.length > 0
        ? locationMeasurements.reduce((sum, m) => sum + m.soundLevel, 0) /
          locationMeasurements.length
        : null;

    let ambianceLevel = "unknown";

    if (avgSoundLevel !== null) {
      if (avgSoundLevel < 40) ambianceLevel = "calm";
      else if (avgSoundLevel < 60) ambianceLevel = "normal";
      else if (avgSoundLevel < 75) ambianceLevel = "busy";
      else ambianceLevel = "noisy";
    }

    return res.status(200).json({
      success: true,
      location,
      data: {
        measurementsCount: locationMeasurements.length,
        observationsCount: observations.length,
        averageSoundLevel: avgSoundLevel,
        ambianceLevel,
        latestObservation: observations[0] || null,
      },
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

    const locationMeasurements = measurements.filter(
      (m) => m.deviceId && m.deviceId.location === location
    );

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

    const measurements = await Measurement.find().populate(
      "deviceId",
      "location"
    );

    const locationMeasurements = measurements.filter(
      (m) => m.deviceId && m.deviceId.location === location
    );

    if (locationMeasurements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune mesure trouvée pour ce lieu.",
      });
    }

    const hourlyData = {};

    locationMeasurements.forEach((measurement) => {
      const hour = new Date(measurement.timestamp).getHours();

      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          hour,
          count: 0,
          totalSoundLevel: 0,
        };
      }

      hourlyData[hour].count += 1;
      hourlyData[hour].totalSoundLevel += measurement.soundLevel;
    });

    const quietHours = Object.values(hourlyData)
      .map((item) => ({
        hour: item.hour,
        averageSoundLevel: item.totalSoundLevel / item.count,
        count: item.count,
      }))
      .sort((a, b) => a.averageSoundLevel - b.averageSoundLevel);

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

module.exports = {
  getAmbianceSummary,
  getAmbianceHistory,
  getQuietHours,
};