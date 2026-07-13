const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
     type: String,
     required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowecase: true,

    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "author",
        "viewer"
      ],
      default: "viewer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);