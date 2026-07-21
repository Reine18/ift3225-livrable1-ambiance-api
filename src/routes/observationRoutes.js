const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createObservation,
  getObservations,
} = require("../controllers/observationController");

console.log("protect =", typeof protect);
console.log("createObservation =", typeof createObservation);
console.log("getObservations :", typeof getObservations);

const router = express.Router();

router.post("/", protect, createObservation);
router.get("/", getObservations);

module.exports = router;

