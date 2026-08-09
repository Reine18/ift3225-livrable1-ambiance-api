const crypto = require("crypto");
const Device = require("../models/Device");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function DeviceWithApiKey(device) {
  return {
    id: device._id,
    name: device.name,
    location: device.location,
    apiKey: device.apiKey,
  };
}
//verifie name et location ,
//genere une cle api secrisee
//cree le device dans mangodb
//et retourne les info du device 
async function createDeviceService({
  name,
  location,
  locationId,
} = {}) {
  if (!name || !location) {
    throw createError(
      "Les champs name et location sont requis.",
      400
    );
  }

  const apiKey = crypto
    .randomBytes(32)
    .toString("hex");

  const device = await Device.create({
    name: name.trim(),
    location: location.trim(),
    locationId: locationId || null,
    apiKey,
  });

  return DeviceWithApiKey(device);
}

async function getDevicesService() {
  return Device.find().select("-apiKey");
}

module.exports = {
  DeviceWithApiKey,
  createDeviceService,
  getDevicesService,
};