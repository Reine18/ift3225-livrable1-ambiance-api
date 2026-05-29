const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createMeasurement,
  getMeasurements,
} = require("../controllers/measurementController");

const router = express.Router();

router.post("/", protect, createMeasurement);
router.get("/", getMeasurements);

module.exports = router;