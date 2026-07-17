const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/deviceRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const observationRoutes = require("./routes/observationRoutes");
const ambianceRoutes = require("./routes/ambianceRoutes");
const userRoutes= require("./routes/userRoutes");
const locationRoutes= require("./routes/locationRoutes");

const app = express();




// Route temporaire pour tester middlewares

const protect = require("./middlewares/authMiddleware");
const app= express();

app.get("/test-auth", protect, (req, res) => {
  res.json({
    success: true,
    message: "Clé API valide",
    device: {
      id: req.device._id,
      name: req.device.name,
      location: req.device.location,
    },
  });
});

// Fin route temporaire -- à Supprimer 

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IFT3225 API en ligne"
  });
});

app.use("/devices", deviceRoutes);
app.use("/measurements", measurementRoutes);
app.use("/observations", observationRoutes);
app.use("/ambiance", ambianceRoutes);
app.use("/users", userRoutes);
app.use("/locations", locationRoutes);
module.exports = app;