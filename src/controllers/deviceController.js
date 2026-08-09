const {
  createDeviceService,
  getDevicesService,
} = require("../services/deviceService");

// POST /devices
const createDevice = async (req, res) => {
  try {
    const device = await createDeviceService(req.body || {});

    return res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Erreur lors de la création du device.",
    });
  }
};

// GET /devices
const getDevices = async (req, res) => {
  try {
    const devices = await getDevicesService();

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Erreur lors de la récupération des devices.",
    });
  }
};

module.exports = {
  createDevice,
  getDevices,
};