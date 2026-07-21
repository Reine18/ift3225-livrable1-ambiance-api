require("dotenv").config();
const axios = require("axios");

const API_URL = "http://localhost:3000/measurements";
const API_KEY = process.env.DEVICE_API_KEY;
const DEVICE_ID = process.env.DEVICE_ID;
const PHYPHOX_BASE_URL = process.env.PHYPHOX_BASE_URL;
const PHYPHOX_URL = `${PHYPHOX_BASE_URL}/get?dbUncal`;

const sendMeasurement = async () => {
  try {
    const response = await axios.get(PHYPHOX_URL);

    if (!response.data.status?.measuring) {
      console.log("Phyphox arrêté : mesure non envoyée.");
      return;
    }

    const dbData = response.data.buffer?.dbUncal?.buffer;

    if (!dbData || dbData.length === 0) {
      console.log("Aucune donnée dbUncal reçue.");
      return;
    }

    const rawValue = dbData[dbData.length - 1];

    if (rawValue === null || rawValue === undefined) {
      console.log("Mesure ignorée : valeur nulle");
      return;
    }

    const soundLevel = Number(rawValue);

    if (Number.isNaN(soundLevel)) {
      console.log("Mesure ignorée : valeur invalide.");
      return;
    }

    const measurement = {
      deviceId: DEVICE_ID,
      soundLevel,
      amplitude: Math.abs(soundLevel),
      timestamp: new Date().toISOString(),
    };

    const apiResponse = await axios.post(API_URL, measurement, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    console.log("Mesure envoyée à l'API :", apiResponse.data);
  } catch (error) {
    console.error("Erreur bridge :", error.response?.data || error.message);
  }
};

console.log("Bridge Phyphox démarré...");
console.log(`Lecture depuis : ${PHYPHOX_URL}`);
console.log(`Envoi vers : ${API_URL}`);

sendMeasurement();
setInterval(sendMeasurement, 5000);