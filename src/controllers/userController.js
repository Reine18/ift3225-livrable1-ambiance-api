const {
  registerUserService,
  loginUserService,
} = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "L'utilisateur a été créé avec succès.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Erreur lors de l'inscription.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Erreur lors de la connexion.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};