const express = require("express");
const cors = require("cors");

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

module.exports = app;