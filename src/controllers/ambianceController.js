
const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");


const classifyAmbianceRelative= (value,values) => {
  if (value===null || !values.length){
    return "unknown"
  }
  const sorted = [...values].sort((a, b) => a - b);

  const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)];
  const q2 = sorted[Math.floor((sorted.length - 1) * 0.5)];
  const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)];

  if (value <= q1) return "calm";
  if (value <= q2) return "normal";
  if (value <= q3) return "busy";
  return "noisy";


}

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
  

    const avgSoundLevel = soundLevel.length> 0
    ?soundLevel.reduce((sum,v)=> sum + v, 0) / soundLevel/length : null;


    
    
    /* locationMeasurements.length > 0
        ? locationMeasurements.reduce((sum, m) => sum + m.soundLevel, 0) /
          locationMeasurements.length
        : null; */

    const ambianceLevel = avgSoundLevel !== null 
    ? classifyAmbianceRelative(avgSoundLevel, soundLevels) :"unknown";


   /** 
    * Phyphox en dbUncal donne parfois des valeurs négatives, donc les 
    * seuils fixes comme <40 ne correspondent pas bien et classent presque 
    * tout en "calm".Le nouveau code compare les mesures entre elles dans le 
    * même lieu, donc la classification devient adaptée au contexte réel de ce lieu.
    * 
    * 
    * if (avgSoundLevel !== null) {
      if (avgSoundLevel < 40) ambianceLevel = "calm";
      else if (avgSoundLevel < 60) ambianceLevel = "normal";
      else if (avgSoundLevel < 75) ambianceLevel = "busy";
      else ambianceLevel = "noisy";
    }
      
    **/

    return res.status(200).json({
      success: true,
      location,
      data: {
        measurementsCount: locationMeasurements.length,
        observationsCount: observations.length,
        averageSoundLevelDdUncal : avgSoundLevel,
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
        averageSoundLevellDbUncal: item.totalSoundLevel / item.count,
        count: item.count,
      }))
      .sort((a, b) => a.averageSoundLevellDbUncal - b.averageSoundLevelDbUncall);

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