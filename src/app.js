const express = require("express");
const cors = require("cors");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

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

module.exports = app;