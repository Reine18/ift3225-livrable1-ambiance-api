const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationId: { //pour que lancien code continue a fonctionner avec location en texte
                  // et que le new code puisse utiliser locationId poue avoir acces aux coordonnees du lieu 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", deviceSchema);