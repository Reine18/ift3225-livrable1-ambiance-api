const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    soundLevel: {
      type: Number,
      required: true,
    },

    amplitude: {
      type: Number,
      required: true,
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

module.exports =
  mongoose.models.Measurement ||
  mongoose.model("Measurement", measurementSchema);