const {
  createMeasurementService,
  getMeasurementsService,
} = require("../services/measurementService");

// POST /measurements
const createMeasurement = async (req, res) => {
  try {
    const measurement = await createMeasurementService({
      deviceId: req.device?._id, // si le req device nexiste pas le service renvcoie le deviceId est requis
      soundLevel: req.body?.soundLevel,
      amplitude: req.body?.amplitude,
      timestamp: req.body?.timestamp,
    });

    return res.status(201).json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Erreur lors de la création de la mesure.",
    });
  }
};

// GET /measurements
const getMeasurements = async (req, res) => {
  try {
    const measurements = await getMeasurementsService();

    return res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Erreur lors de la récupération des mesures.",
    });
  }
};

module.exports = {
  createMeasurement,
  getMeasurements,
};