const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");

/**
 * Classe une ambiance en comparant le niveau sonore moyen
 * avec la distribution des niveaux sonores du lieu.
 */
const classifyAmbianceRelative = (value, values) => {
  if (value === null || values.length === 0) {
    return "unknown";
  }

  const sorted = [...values].sort((a, b) => a - b);

  const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)];
  const q2 = sorted[Math.floor((sorted.length - 1) * 0.50)];
  const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)];

  if (value <= q1) return "calm";
  if (value <= q2) return "normal";
  if (value <= q3) return "busy";

  return "noisy";
};

// GET /ambiance/:location/summary
const getAmbianceSummary = async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find()
      .populate("deviceId", "location")
      .sort({ timestamp: -1 });

    const locationMeasurements = measurements.filter(
      (measurement) =>
        measurement.deviceId &&
        measurement.deviceId.location === location
    );

    const observations = await Observation.find({ location }).sort({
      timestamp: -1,
    });

    if (
      locationMeasurements.length === 0 &&
      observations.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Aucune donnée trouvée pour ce lieu.",
      });
    }

    // On utilise la valeur absolue des mesures Phyphox
    const soundLevels = locationMeasurements.map((measurement) =>
      Math.abs(measurement.soundLevel)
    );

    const averageSoundLevel =
      soundLevels.length > 0
        ? soundLevels.reduce((sum, value) => sum + value, 0) /
          soundLevels.length
        : null;

    const ambianceLevel =
      averageSoundLevel !== null
        ? classifyAmbianceRelative(
            averageSoundLevel,
            soundLevels
          )
        : "unknown";

    const latestMeasurement = locationMeasurements[0] || null;
    const latestObservation = observations[0] || null;

    const latestTimestamp = [
      latestMeasurement?.timestamp,
      latestObservation?.timestamp,
    ]
      .filter(Boolean)
      .map((timestamp) => new Date(timestamp))
      .sort((a, b) => b - a)[0] || null;

    return res.status(200).json({
      success: true,
      location,
      data: {
        measurementsCount: locationMeasurements.length,
        observationsCount: observations.length,
        averageSoundLevel,
        ambianceLevel,
        latestMeasurement,
        latestObservation,
        latestTimestamp,
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
      (measurement) =>
        measurement.deviceId &&
        measurement.deviceId.location === location
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
      (measurement) =>
        measurement.deviceId &&
        measurement.deviceId.location === location
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

      // Valeur absolue
      hourlyData[hour].totalSoundLevel += Math.abs(
        measurement.soundLevel
      );
    });

    const quietHours = Object.values(hourlyData)
      .map((item) => ({
        hour: item.hour,
        averageSoundLevel:
          item.totalSoundLevel / item.count,
        count: item.count,
      }))
      .sort(
        (a, b) =>
          a.averageSoundLevel -
          b.averageSoundLevel
      );

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
    const forecastHours = Math.min(
      Math.max(requestedHours, 1),
      12
    );

    const measurements = await Measurement.find()
      .populate("deviceId", "location")
      .sort({ timestamp: 1 });

    const locationMeasurements = measurements.filter(
      (measurement) =>
        measurement.deviceId &&
        measurement.deviceId.location === location
    );

    if (locationMeasurements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune mesure trouvée pour ce lieu.",
      });
    }

    /*
     * Regroupe tout l'historique par heure de la journée :
     * toutes les mesures prises à 15 h, à 16 h, etc.
     */
    const historicalByHour = {};

    locationMeasurements.forEach((measurement) => {
      const date = new Date(measurement.timestamp);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const hour = date.getHours();
      const soundLevel = Math.abs(
        Number(measurement.soundLevel)
      );

      if (!Number.isFinite(soundLevel)) {
        return;
      }

      if (!historicalByHour[hour]) {
        historicalByHour[hour] = {
          totalSoundLevel: 0,
          count: 0,
        };
      }

      historicalByHour[hour].totalSoundLevel += soundLevel;
      historicalByHour[hour].count += 1;
    });

    const classifyProjectedLevel = (averageSoundLevel) => {
      if (averageSoundLevel === null) {
        return "unknown";
      }

      /*
       * Seuils indicatifs pour la valeur absolue dbUncal.
       * Ils pourront être ajustés après davantage de collectes.
       */
      if (averageSoundLevel < 55) return "calm";
      if (averageSoundLevel < 65) return "normal";
      return "busy";
    };

    const getConfidence = (count) => {
      if (count >= 20) return "high";
      if (count >= 8) return "medium";
      if (count >= 3) return "low";
      return "insufficient";
    };

    const now = new Date();

    const forecast = Array.from(
      { length: forecastHours },
      (_, index) => {
        const projectedDate = new Date(now);

        projectedDate.setHours(
          now.getHours() + index + 1,
          0,
          0,
          0
        );

        const hour = projectedDate.getHours();
        const historicalData = historicalByHour[hour];

        if (!historicalData) {
          return {
            hour,
            projectedAt: projectedDate.toISOString(),
            averageSoundLevel: null,
            classification: "unknown",
            measurementsCount: 0,
            confidence: "insufficient",
          };
        }

        const averageSoundLevel =
          historicalData.totalSoundLevel /
          historicalData.count;

        return {
          hour,
          projectedAt: projectedDate.toISOString(),
          averageSoundLevel,
          classification:
            classifyProjectedLevel(averageSoundLevel),
          measurementsCount: historicalData.count,
          confidence: getConfidence(historicalData.count),
        };
      }
    );

    return res.status(200).json({
      success: true,
      location,
      generatedAt: now.toISOString(),
      data: forecast,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Erreur lors du calcul de la projection d'ambiance.",
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
