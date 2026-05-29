const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    
    location: {
      type: String,
      required: true,
    },

    vibe: {
      type: String,
      required: true,
      enum: [
        "calm",
        "normal",
        "busy",
        "noisy"
      ]
    },

    sourceProximity: {
      type: String,
      enum: [
        "near",
        "medium",
        "far"
      ]
    },

    notes: {
      type: String,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Observation", observationSchema);