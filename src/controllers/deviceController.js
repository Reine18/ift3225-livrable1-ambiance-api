const crypto = require("crypto");
const Device = require("../models/Device");

// POST /devices
const createDevice = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Les champs name et location sont requis.",
      });
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    const device = await Device.create({
      name,
      location,
      apiKey,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: device._id,
        name: device.name,
        location: device.location,
        apiKey: device.apiKey,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du device.",
      error: error.message,
    });
  }
};

// GET /devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().select("-apiKey");

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des devices.",
      error: error.message,
    });
  }
};

module.exports = {
  createDevice,
  getDevices,
};