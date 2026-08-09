const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      default: null, //on a eu un blocage dans le flux usager connecte
    },
    
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationId: { //comme on a cree un modele Location on ajoute ici locationId pour relier
                  //une observation a un lieu structure
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,     // pour que les anciens lieux qui nont pas de locationId ne se perdent pas 
                        // permet la transition entre phase 1 et 2 
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,

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

module.exports =
  mongoose.models.Observation ||
  mongoose.model("Observation", observationSchema);