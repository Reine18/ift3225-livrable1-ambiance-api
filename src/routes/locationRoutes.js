const express = require("express");
const router = express.Router();
const {
  getLocations,
  createLocation,
} = require("../controllers/locationController");

router.get("/", getLocations);
router.post("/", createLocation);

module.exports = router;