require("dotenv").config();

const crypto = require("crypto");
const connectDB = require("../config/db");
const Device = require("../models/Device");
const Measurement = require("../models/Measurement");
const Observation = require("../models/Observation");
const Location = require("../models/Location");

const seedData = async () => {
  try {
    await connectDB();

    await Measurement.deleteMany();
    await Observation.deleteMany();
    await Device.deleteMany();
    await Location.deleteMany();

    await Location.insertMany([
  {
    idlocation: "bibliotheque_udem",
    name: "Bibliothèque UdeM",
    latitude: 45.5048,
    longitude: -73.6135,
  },
  {
    idlocation: "cafeteria_udem",
    name: "Cafétéria UdeM",
    latitude: 45.5052,
    longitude: -73.6129,
  },
]);


    const device = await Device.create({
      name: "telephone_reine",
      location: "bibliotheque_udem",
      apiKey: crypto.randomBytes(32).toString("hex"),
    });

    const now = new Date();

    await Measurement.insertMany([
      {
        deviceId: device._id,
        soundLevel: -64.2,
        amplitude: 64.2,
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
      },
      {
        deviceId: device._id,
        soundLevel: -67.8,
        amplitude: 67.8,
        timestamp: new Date(now.getTime() - 45 * 60 * 1000),
      },
      {
        deviceId: device._id,
        soundLevel: -58.4,
        amplitude: 58.4,
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      },
    ]);

    await Observation.insertMany([
      {
        deviceId: device._id,
        location: "bibliotheque_udem",
        vibe: "calm",
        sourceProximity: "far",
        notes: "Ambiance calme, peu de discussions autour.",
        timestamp: new Date(now.getTime() - 50 * 60 * 1000),
      },
      {
        deviceId: device._id,
        location: "bibliotheque_udem",
        vibe: "normal",
        sourceProximity: "medium",
        notes: "Quelques passages et conversations légères.",
        timestamp: new Date(now.getTime() - 20 * 60 * 1000),
      },
    ]);

    console.log("Données seed insérées avec succès.");
    console.log("Device créé :");
    console.log({
      name: device.name,
      location: device.location,
      apiKey: device.apiKey,
    });

    process.exit(0);
  } catch (error) {
    console.error("Erreur seed :", error.message);
    process.exit(1);
  }
};

seedData();