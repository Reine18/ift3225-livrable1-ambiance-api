const express = require("express");
const {
  createDevice,
  getDevices,
} = require("../controllers/deviceController");

const router = express.Router();

router.post("/", createDevice);
router.get("/", getDevices);

module.exports = router;