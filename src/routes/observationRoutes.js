const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createObservation,
  getObservations,
} = require("../controllers/observationController");

const router = express.Router();

router.post("/", protect, createObservation);
router.get("/", getObservations);

module.exports = router;