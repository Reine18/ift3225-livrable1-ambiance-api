const Device = require("../models/Device");

const protect = async (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Clé API absente",
      });
    }

    const device = await Device.findOne({ apiKey });

    if (!device) {
      return res.status(403).json({
        success: false,
        message: "Clé API invalide",
      });
    }

    req.device = device;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = protect;