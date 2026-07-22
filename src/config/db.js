const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connecté");
    console.log("Base utilisée :", connection.connection.name);
  } catch (error) {
    console.error("Erreur MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;