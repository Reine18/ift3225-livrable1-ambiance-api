const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    idlocation: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);