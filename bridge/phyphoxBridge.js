const axios = require("axios");

// API backend
const API_URL = "http://localhost:3000/measurements";

// Clé API générée par POST /devices
const API_KEY = "fc5d8238b998c76e13851dc3fc93c5f4739db611eb6310fae08da29e50580379";

// Adresse affichée par Phyphox sur telephone Reine
const PHYPHOX_BASE_URL = "http://10.51.250.188";

// Endpoint Phyphox pour l'intensité sonore
const PHYPHOX_URL = `${PHYPHOX_BASE_URL}/get?dbUncal`;

const sendMeasurement = async () => {
  try {
    const response = await axios.get(PHYPHOX_URL);

    console.log(
      "Données Phyphox reçues :",
      JSON.stringify(response.data, null, 2)
    );

    if (!response.data.status?.measuring) {
      console.log("Phyphox arrêté : mesure non envoyée.");
      return;
    }

    const dbData = response.data.buffer?.dbUncal?.buffer;

    if (!dbData || dbData.length === 0) {
      console.log("Aucune donnée dbUncal reçue.");
      return;
    }

    const soundLevel = Number(dbData[dbData.length - 1]);

    if (Number.isNaN(soundLevel)) {
      console.log("Mesure ignorée : valeur invalide.");
      return;
    }

    const measurement = {
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