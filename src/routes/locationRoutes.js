const express = require("express")
const router = express.Router();
const {getLocations}= require("../controllers/locationController");

router.get("/", getLocations); // quand on fait get/locations ca appelle getLocations 
module.exports= router;