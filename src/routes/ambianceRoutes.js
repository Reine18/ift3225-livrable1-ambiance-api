const express = require("express");

const {
  getAmbianceSummary,
  getAmbianceHistory,
  getQuietHours,
  getAmbianceForecast,
} = require("../controllers/ambianceController");

const router = express.Router();

router.get("/:location/summary", getAmbianceSummary);

router.get("/:location/history", getAmbianceHistory);

router.get("/:location/quiet-hours", getQuietHours);

router.get("/:location/forecast", getAmbianceForecast);

module.exports = router;